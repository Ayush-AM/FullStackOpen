import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries/queries';
import GenreFilter from './GenreFilter';

const Books = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  
  // Query for all books (no genre filter)
  const allBooksQuery = useQuery(ALL_BOOKS);
  
  // Query for books by specific genre (only executed when selectedGenre is not null)
  const booksByGenreQuery = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre
  });

  if (!show) {
    return null;
  }

  // Determine which query result to use
  const { loading, error, data } = selectedGenre ? booksByGenreQuery : allBooksQuery;

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const booksToDisplay = data.allBooks;

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  return (
    <div>
      <h2>books</h2>
      
      <GenreFilter 
        selectedGenre={selectedGenre} 
        onGenreChange={handleGenreChange} 
      />
      
      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Title</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Author</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Published</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Genres</th>
          </tr>
        </thead>
        <tbody>
          {booksToDisplay.map((book) => (
            <tr key={book.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{book.title}</td>
              <td style={{ padding: '8px' }}>{book.author.name}</td>
              <td style={{ padding: '8px' }}>{book.published}</td>
              <td style={{ padding: '8px' }}>{book.genres.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {booksToDisplay.length === 0 && (
        <p>No books found in this genre.</p>
      )}
    </div>
  );
};

export default Books;