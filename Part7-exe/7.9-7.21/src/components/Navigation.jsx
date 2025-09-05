// src/components/Navigation.jsx
import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => {
  const padding = {
    padding: 5
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '10px', marginBottom: '20px' }}>
      <Link to="/" style={padding}>blogs</Link>
      <Link to="/users" style={padding}>users</Link>
      {user ? (
        <span style={padding}>
          <strong>{user.name}</strong> logged in
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>logout</button>
        </span>
      ) : (
        <Link to="/login" style={padding}>login</Link>
      )}
    </div>
  )
}

export default Navigation