const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Author = require('../models/Author');
const Book = require('../models/Book');
const User = require('../models/User');
const { JWT_SECRET } = require('../utils/config');

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filter = {};
      
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filter.author = author._id;
        } else {
          return [];
        }
      }
      
      if (args.genre) {
        filter.genres = { $in: [args.genre] };
      }
      
      return Book.find(filter).populate('author');
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      return authors.map(async (author) => {
        const bookCount = await Book.countDocuments({ author: author._id });
        return {
          ...author.toJSON(),
          bookCount
        };
      });
    },
    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        });
      }

      let author = await Author.findOne({ name: args.author });
      
      if (!author) {
        try {
          author = new Author({ name: args.author });
          await author.save();
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error
            }
          });
        }
      }
      
      try {
        const book = new Book({
          ...args,
          author: author._id
        });
        
        await book.save();
        await book.populate('author');
        return book;
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        });
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        });
      }

      try {
        const author = await Author.findOne({ name: args.name });
        if (!author) {
          return null;
        }
        
        author.born = args.setBornTo;
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        });
      }
    },
    createUser: async (root, args) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);
      
      try {
        const user = new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
          passwordHash
        });
        
        return user.save();
      } catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash);
      
      if (!(user && passwordCorrect)) {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      }
      
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      
      return { value: jwt.sign(userForToken, JWT_SECRET) };
    }
  }
};

module.exports = resolvers;