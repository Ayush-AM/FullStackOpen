// src/components/AnecdoteList.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeAnecdotes, voteAnecdote } from '../features/anecdotesSlice'
import { showNotification } from '../features/notificationSlice'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  
  // 6.16: Initialize with async action creator
  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])

  const filteredAnecdotes = [...anecdotes]
    .filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.votes - a.votes)

  const handleVote = async (anecdote) => {
    try {
      // 6.18: Async voting with backend save
      const updatedAnecdote = await dispatch(voteAnecdote(anecdote.id)).unwrap()
      
      // 6.19: Improved notification with duration parameter
      dispatch(showNotification(`you voted '${updatedAnecdote.content}'`, 5))
    } catch (error) {
      dispatch(showNotification('Error voting for anecdote', 5))
    }
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {filteredAnecdotes.map(anecdote =>
        <div key={anecdote.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <div style={{ fontSize: '16px', marginBottom: '5px' }}>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => handleVote(anecdote)} style={{ marginLeft: '10px' }}>
              vote
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList