import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../queries/queries';
import { useAuth } from '../hooks/useAuth';

const LoginForm = ({ show, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const [userLogin] = useMutation(LOGIN, {
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    try {
      const result = await userLogin({
        variables: { username, password }
      });

      if (result.data) {
        const token = result.data.login.value;
        login(token);
        setPage('authors');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>username</label>
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>password</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;