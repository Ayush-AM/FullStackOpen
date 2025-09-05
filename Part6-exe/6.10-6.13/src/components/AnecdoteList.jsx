// src/components/AnecdoteList.jsx
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../features/anecdotesSlice'
import { showNotification } from '../features/notificationSlice'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  
  // Make a copy for sorting (6.11)
  const filteredAnecdotes = [...anecdotes]
    .filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.votes - a.votes)

  const handleVote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(showNotification(`you voted '${anecdote.content}'`, 5000))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList