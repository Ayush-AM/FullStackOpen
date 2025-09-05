// src/components/AnecdoteForm.jsx
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../features/anecdotesSlice'
import { showNotification } from '../features/notificationSlice'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content)) // 6.15: Stores in backend
    dispatch(showNotification(`you created '${content}'`, 5000))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm