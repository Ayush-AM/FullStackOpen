import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries/queries';
import GenreFilter from './GenreFilter';

const BooksWithLocalFilter = ({ show }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { loading, error, data } = useQuery(ALL_BOOKS);

  if (!show) {
    return null;
  }

  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Filter books locally based on selected genre
  const booksToDisplay = selectedGenre
    ? data.allBooks.filter(book => book.genres.includes(selectedGenre))
    : data.allBooks;

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

export default BooksWithLocalFilter;