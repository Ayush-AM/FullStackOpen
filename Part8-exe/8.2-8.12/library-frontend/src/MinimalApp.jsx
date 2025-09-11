import React from 'react';

const MinimalApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Library App - Minimal Test</h1>
      <p>If you can see this, your React setup is working!</p>
      <div>
        <button>Authors</button>
        <button>Books</button>
        <button>Add Book</button>
        <button>Set Birthyear</button>
      </div>
    </div>
  );
};

export default MinimalApp;