import React from 'react';
import { useQuery } from '@apollo/client';
import { ME, BOOKS_BY_GENRE } from '../queries/queries';

const Recommendations = ({ show }) => {
  const userResult = useQuery(ME);
  const booksResult = useQuery(BOOKS_BY_GENRE, {
    skip: !userResult.data || !userResult.data.me,
    variables: { 
      genre: userResult.data?.me?.favoriteGenre 
    }
  });

  if (!show) {
    return null;
  }

  if (userResult.loading) return <div>Loading...</div>;
  if (userResult.error) return <div>Error: {userResult.error.message}</div>;

  const user = userResult.data.me;

  if (!user) {
    return <div>Please log in to see recommendations</div>;
  }

  if (booksResult.loading) return <div>Loading books...</div>;
  if (booksResult.error) return <div>Error: {booksResult.error.message}</div>;

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{user.favoriteGenre}</strong></p>
      
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Title</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Author</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Published</th>
          </tr>
        </thead>
        <tbody>
          {booksResult.data.allBooks.map((book) => (
            <tr key={book.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{book.title}</td>
              <td style={{ padding: '8px' }}>{book.author.name}</td>
              <td style={{ padding: '8px' }}>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;