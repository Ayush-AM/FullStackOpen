// src/components/Menu.jsx
import { Link } from 'react-router-dom'

const Menu = () => {
  const padding = { paddingRight: 5 }
  
  return (
    <div>
      <Link to="/" style={padding}>anecdotes</Link>
      <Link to="/create" style={padding}>create new</Link>
      <Link to="/about" style={padding}>about</Link>
      <Link to="/country" style={padding}>country</Link>
      <Link to="/ultimate" style={padding}>ultimate hooks</Link>
    </div>
  )
}

export default Menu