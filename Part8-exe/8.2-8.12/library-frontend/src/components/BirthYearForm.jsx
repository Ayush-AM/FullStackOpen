import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_AUTHOR, ALL_AUTHORS, ALL_AUTHORS_NAMES } from '../queries/queries';
import Select from 'react-select';

const BirthYearForm = ({ show }) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const { loading, data } = useQuery(ALL_AUTHORS_NAMES);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.error('Error updating author:', error);
    }
  });

  if (!show) {
    return null;
  }

  if (loading) return <div>Loading...</div>;

  const authors = data.allAuthors.map(author => ({
    value: author.name,
    label: author.name
  }));

  const submit = async (event) => {
    event.preventDefault();

    const bornInt = parseInt(born);

    editAuthor({
      variables: {
        name: name.value,
        setBornTo: bornInt
      }
    });

    setName('');
    setBorn('');
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>name</label>
          <Select
            value={name}
            onChange={setName}
            options={authors}
            placeholder="Select author"
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>born</label>
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none' }}>
          update author
        </button>
      </form>
    </div>
  );
};

export default BirthYearForm;