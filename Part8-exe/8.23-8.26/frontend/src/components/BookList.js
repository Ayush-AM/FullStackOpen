import { useQuery, useSubscription } from '@apollo/client';
import { useState, useEffect } from 'react';
import { ALL_BOOKS } from '../queries';
import { BOOK_ADDED } from '../subscriptions';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const result = useQuery(ALL_BOOKS);
  
  // Subscription for new books (8.24, 8.25)
  const { data: subscriptionData } = useSubscription(BOOK_ADDED);
  
  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks);
    }
  }, [result.data]);
  
  useEffect(() => {
    if (subscriptionData) {
      const newBook = subscriptionData.bookAdded;
      
      // Notify user (8.24)
      window.alert(`New book added: ${newBook.title} by ${newBook.author.name}`);
      
      // Update book list (8.25)
      setBooks(prevBooks => [...prevBooks, newBook]);
    }
  }, [subscriptionData]);
  
  if (result.loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h2>Books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;