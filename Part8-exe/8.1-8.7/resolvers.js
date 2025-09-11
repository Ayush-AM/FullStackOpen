const { authors, books } = require('./data');

const resolvers = {
  Query: {
    // 8.1: The number of books and authors
    bookCount: () => books.length,
    authorCount: () => authors.length,

    // 8.2: All books (with 8.4 and 8.5 filters)
    allBooks: (root, args) => {
      let filteredBooks = [...books];

      if (args.author) {
        filteredBooks = filteredBooks.filter(book => book.author === args.author);
      }

      if (args.genre) {
        filteredBooks = filteredBooks.filter(book => 
          book.genres.includes(args.genre)
        );
      }

      return filteredBooks;
    },

    // 8.3: All authors with bookCount
    allAuthors: () => {
      return authors.map(author => ({
        ...author,
        bookCount: books.filter(book => book.author === author.name).length
      }));
    }
  },

  Mutation: {
    // 8.6: Adding a book
    addBook: (root, args) => {
      const book = { ...args };
      books.push(book);

      // Check if author exists, if not add them
      if (!authors.find(a => a.name === args.author)) {
        authors.push({ name: args.author });
      }

      return book;
    },

    // 8.7: Updating the birth year of an author
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name);
      
      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      return author;
    }
  }
};

module.exports = resolvers;