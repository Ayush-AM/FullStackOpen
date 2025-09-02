import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])

  // fetch persons from server on first render
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <ul>
        {persons.map(person => 
          <li key={person.id}>
            {person.name} {person.number}
          </li>
        )}
      </ul>
    </div>
  )
}

export default App
