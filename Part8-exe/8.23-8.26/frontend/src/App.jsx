import { useState } from 'react';
import BookList from './components/BookList';
import AuthorList from './components/AuthorList';
import BookForm from './components/BookForm';

const App = () => {
  const [page, setPage] = useState('books');

  return (
    <div>
      <div>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <BookList show={page === 'books'} />
      <AuthorList show={page === 'authors'} />
      <BookForm show={page === 'add'} />
    </div>
  );
};

export default App;