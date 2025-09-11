import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useQuery } from '@apollo/client';
import client from './apolloClient';
import { useAuth } from './hooks/useAuth';
import { ME } from './queries/queries';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import BirthYearForm from './components/BirthYearForm';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';

const App = () => {
  const [page, setPage] = useState('authors');
  const { token, logout, setUser, isLoggedIn } = useAuth();
  
  useQuery(ME, {
    skip: !token,
    onCompleted: (data) => {
      if (data && data.me) {
        setUser(data.me);
      }
    }
  });

  return (
    <ApolloProvider client={client}>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setPage('authors')}
            style={{ marginRight: '10px', padding: '8px 16px' }}
          >
            authors
          </button>
          <button 
            onClick={() => setPage('books')}
            style={{ marginRight: '10px', padding: '8px 16px' }}
          >
            books
          </button>
          {isLoggedIn ? (
            <>
              <button 
                onClick={() => setPage('add')}
                style={{ marginRight: '10px', padding: '8px 16px' }}
              >
                add book
              </button>
              <button 
                onClick={() => setPage('birthyear')}
                style={{ marginRight: '10px', padding: '8px 16px' }}
              >
                set birthyear
              </button>
              <button 
                onClick={() => setPage('recommendations')}
                style={{ marginRight: '10px', padding: '8px 16px' }}
              >
                recommendations
              </button>
              <button 
                onClick={logout}
                style={{ padding: '8px 16px' }}
              >
                logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => setPage('login')}
              style={{ padding: '8px 16px' }}
            >
              login
            </button>
          )}
        </div>

        <Authors show={page === 'authors'} />

        <Books show={page === 'books'} />

        <NewBook show={page === 'add'} />

        <BirthYearForm show={page === 'birthyear'} />

        <Recommendations show={page === 'recommendations'} />

        <LoginForm show={page === 'login'} setPage={setPage} />
      </div>
    </ApolloProvider>
  );
};

export default App;