import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_GENRES } from '../queries/queries';

const GenreFilter = ({ selectedGenre, onGenreChange }) => {
  const { loading, error, data } = useQuery(ALL_GENRES);

  if (loading) return <div>Loading genres...</div>;
  if (error) return <div>Error loading genres: {error.message}</div>;

  // Extract unique genres from all books
  const allGenres = data.allBooks.flatMap(book => book.genres);
  const uniqueGenres = [...new Set(allGenres)];

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Filter by Genre</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button
          onClick={() => onGenreChange(null)}
          style={{
            padding: '8px 16px',
            backgroundColor: !selectedGenre ? '#2196F3' : '#f0f0f0',
            color: !selectedGenre ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          All Genres
        </button>
        
        {uniqueGenres.map(genre => (
          <button
            key={genre}
            onClick={() => onGenreChange(genre)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedGenre === genre ? '#2196F3' : '#f0f0f0',
              color: selectedGenre === genre ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {genre}
          </button>
        ))}
      </div>
      
      {selectedGenre && (
        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
          Showing books in genre: <strong>{selectedGenre}</strong>
        </p>
      )}
    </div>
  );
};

export default GenreFilter;