// src/components/LoginForm.jsx
import { useState } from 'react'
import { useNotification } from '../context/NotificationContext'
import loginService from '../services/login'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { setNotification } = useNotification()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      onLogin(user)
      setUsername('')
      setPassword('')
      setNotification('Login successful!')
    } catch (error) {
      setNotification('Wrong credentials', 5)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm