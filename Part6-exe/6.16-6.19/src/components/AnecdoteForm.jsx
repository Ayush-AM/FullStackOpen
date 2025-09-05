// src/components/AnecdoteForm.jsx
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../features/anecdotesSlice'
import { showNotification } from '../features/notificationSlice'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value.trim()
    
    if (!content) return
    
    event.target.anecdote.value = ''
    
    try {
      // 6.17: Async creation with backend save
      const newAnecdote = await dispatch(createAnecdote(content)).unwrap()
      
      // 6.19: Improved notification with duration parameter
      dispatch(showNotification(`you created '${newAnecdote.content}'`, 5))
    } catch (error) {
      dispatch(showNotification('Error creating anecdote', 5))
    }
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Create new anecdote</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input 
            name="anecdote" 
            placeholder="Enter anecdote content..."
            style={{ padding: '8px', width: '300px', marginRight: '10px' }}
          />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '8px 16px' }}>
          create
        </button>
      </form>
    </div>
  )
}

export default AnecdoteForm