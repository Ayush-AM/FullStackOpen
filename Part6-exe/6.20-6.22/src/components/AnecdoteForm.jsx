// src/components/AnecdoteForm.jsx
import { useState } from 'react'
import { useCreateAnecdote } from '../hooks/useAnecdotes'

const AnecdoteForm = ({ setNotification }) => {
  const [content, setContent] = useState('')
  const createMutation = useCreateAnecdote()

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (content.trim().length < 5) {
      setNotification('Anecdote must be at least 5 characters long')
      setTimeout(() => setNotification(''), 5000)
      return
    }
    
    try {
      // 6.21: Create using React Query mutation
      createMutation.mutate(content)
      setContent('')
      setNotification(`you created '${content}'`)
      setTimeout(() => setNotification(''), 5000)
    } catch (error) {
      if (error.response?.status === 400) {
        setNotification('Anecdote must be at least 5 characters long')
      } else {
        setNotification('Error creating anecdote')
      }
      setTimeout(() => setNotification(''), 5000)
    }
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Create new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter anecdote content (min 5 characters)..."
            style={{ padding: '8px', width: '300px', marginRight: '10px' }}
          />
        </div>
        <button 
          type="submit" 
          style={{ marginTop: '10px', padding: '8px 16px' }}
          disabled={createMutation.isLoading}
        >
          {createMutation.isLoading ? 'Creating...' : 'create'}
        </button>
      </form>
    </div>
  )
}

export default AnecdoteForm