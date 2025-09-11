import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../queries/queries';

const NewBook = ({ show }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
    onError: (error) => {
      console.error('Error adding book:', error);
    }
  });

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    const publishedInt = parseInt(published);

    addBook({
      variables: {
        title,
        author,
        published: publishedInt,
        genres
      }
    });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    if (genre.trim() !== '') {
      setGenres(genres.concat(genre.trim()));
      setGenre('');
    }
  };

  return (
    <div>
      <h2>add book</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>title</label>
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>author</label>
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>published</label>
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>genre</label>
          <div style={{ display: 'flex' }}>
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
              style={{ flex: 1, padding: '8px', boxSizing: 'border-box', marginRight: '5px' }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addGenre();
                }
              }}
            />
            <button onClick={addGenre} type="button" style={{ padding: '8px 16px' }}>
              add genre
            </button>
          </div>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>genres:</label>
          <span>{genres.join(', ')}</span>
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          create book
        </button>
      </form>
    </div>
  );
};

export default NewBook;