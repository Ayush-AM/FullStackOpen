const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const Book = require('../models/Book');
const Author = require('../models/Author');
const authorLoader = require('../dataloaders/authorLoader');

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filter = {};
      
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filter.author = author._id;
        }
      }
      
      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }
      
      return Book.find(filter).populate('author');
    },
    allAuthors: async () => {
      // Using DataLoader to solve n+1 problem (8.26)
      const authors = await Author.find({});
      
      // For each author, use the DataLoader to get book count
      return Promise.all(
        authors.map(async (author) => {
          const bookCount = await authorLoader.load(author._id.toString());
          return {
            ...author.toObject(),
            bookCount
          };
        })
      );
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });
      
      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }
      
      const book = new Book({ ...args, author: author._id });
      await book.save();
      
      // Populate the author field before publishing
      const populatedBook = await Book.findById(book._id).populate('author');
      
      // Publish the subscription (8.23)
      pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook });
      
      return populatedBook;
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      
      author.born = args.setBornTo;
      await author.save();
      
      return author;
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
};

module.exports = resolvers;