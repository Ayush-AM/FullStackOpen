import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries/queries';

const Books = ({ show }) => {
  const { loading, error, data } = useQuery(ALL_BOOKS);

  if (!show) {
    return null;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>books</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Title</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Author</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Published</th>
          </tr>
        </thead>
        <tbody>
          {data.allBooks.map((book) => (
            <tr key={book.title} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{book.title}</td>
              <td style={{ padding: '8px' }}>{book.author}</td>
              <td style={{ padding: '8px' }}>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;