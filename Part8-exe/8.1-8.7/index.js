const { ApolloServer, gql } = require('apollo-server');

// Sample data
let authors = [
  {
    name: "Robert Martin",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky",
  },
  {
    name: "Sandi Metz",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon",
    published: 1872,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "revolution"],
  },
];

// Define GraphQL schema
const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

// Implement resolvers
const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
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
    allAuthors: () => {
      return authors.map(author => {
        const bookCount = books.filter(book => book.author === author.name).length;
        return {
          ...author,
          bookCount
        };
      });
    }
  },
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args };
      books = books.concat(book);
      
      // Check if author exists, if not add them
      if (!authors.find(a => a.name === args.author)) {
        authors = authors.concat({ name: args.author });
      }
      
      return book;
    },
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name);
      if (!author) {
        return null;
      }
      
      const updatedAuthor = { ...author, born: args.setBornTo };
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a);
      return updatedAuthor;
    }
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});