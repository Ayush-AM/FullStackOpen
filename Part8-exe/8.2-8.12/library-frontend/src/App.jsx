import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';

// Simple test component
const TestComponent = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Library App</h1>
      <p>If you can see this, React is working!</p>
    </div>
  );
};

const App = () => {
  return (
    <ApolloProvider client={client}>
      <TestComponent />
    </ApolloProvider>
  );
};

export default App;