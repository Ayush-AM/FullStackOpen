import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_AUTHORS } from '../queries/queries';

const Authors = ({ show }) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);

  if (!show) {
    return null;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>authors</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Born</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Books</th>
          </tr>
        </thead>
        <tbody>
          {data.allAuthors.map((a) => (
            <tr key={a.name} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{a.name}</td>
              <td style={{ padding: '8px' }}>{a.born || 'N/A'}</td>
              <td style={{ padding: '8px' }}>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Authors;