// src/components/App.jsx
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const counter = useSelector(state => state)

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Give Feedback</h1>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => dispatch({ type: 'GOOD' })}
          style={{ margin: '5px', padding: '10px 15px' }}
        >
          Good
        </button>
        <button 
          onClick={() => dispatch({ type: 'OK' })}
          style={{ margin: '5px', padding: '10px 15px' }}
        >
          Neutral
        </button>
        <button 
          onClick={() => dispatch({ type: 'BAD' })}
          style={{ margin: '5px', padding: '10px 15px' }}
        >
          Bad
        </button>
        <button 
          onClick={() => dispatch({ type: 'ZERO' })}
          style={{ margin: '5px', padding: '10px 15px', backgroundColor: '#ff4444', color: 'white' }}
        >
          Reset
        </button>
      </div>
      
      <h2>Statistics</h2>
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
        <p>Good: {counter.good}</p>
        <p>Neutral: {counter.ok}</p>
        <p>Bad: {counter.bad}</p>
        <p><strong>Total: {counter.good + counter.ok + counter.bad}</strong></p>
      </div>
    </div>
  )
}

export default App