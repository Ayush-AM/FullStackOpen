// src/App.jsx
import { useState } from 'react'
import { useAnecdotes } from './hooks/useAnecdotes'
import Notification from './components/Notification'
import Filter from './components/Filter'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'

const App = () => {
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState('')
  
  // 6.20: Get anecdotes with React Query
  const { data: anecdotes, isLoading, isError, error } = useAnecdotes()

  if (isLoading) {
    return <div>Loading anecdotes...</div>
  }

  if (isError) {
    // 6.20: Error handling
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Anecdote service not available due to problems in server</h2>
        <p>Error: {error.message}</p>
        <p>Please make sure the JSON Server is running on port 3001</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Anecdotes</h1>
      <Notification message={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <AnecdoteList 
        anecdotes={anecdotes} 
        filter={filter} 
        setNotification={setNotification} 
      />
      <AnecdoteForm setNotification={setNotification} />
    </div>
  )
}

export default App