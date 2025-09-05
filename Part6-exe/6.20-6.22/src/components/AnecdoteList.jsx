// src/components/AnecdoteList.jsx
import { useVoteAnecdote } from '../hooks/useAnecdotes'

const AnecdoteList = ({ anecdotes, filter, setNotification }) => {
  const voteMutation = useVoteAnecdote()

  const filteredAnecdotes = anecdotes
    .filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.votes - a.votes)

  const handleVote = async (anecdote) => {
    try {
      const updatedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }
      
      // 6.22: Vote using React Query mutation
      voteMutation.mutate({
        id: anecdote.id,
        anecdote: updatedAnecdote
      })
      
      setNotification(`you voted '${anecdote.content}'`)
      setTimeout(() => setNotification(''), 5000)
    } catch (error) {
      setNotification('Error voting for anecdote')
      setTimeout(() => setNotification(''), 5000)
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
            <button 
              onClick={() => handleVote(anecdote)} 
              style={{ marginLeft: '10px' }}
              disabled={voteMutation.isLoading}
            >
              {voteMutation.isLoading ? 'Voting...' : 'vote'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList