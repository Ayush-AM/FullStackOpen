// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useUser } from './hooks/useUser'
import { NotificationProvider } from './context/NotificationContext'
import Navigation from './components/Navigation'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import UserList from './components/UserList'
import User from './components/User'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'

const App = () => {
  const { user, login, logout } = useUser()
  const queryClient = useQueryClient()

  if (user) {
    blogService.setToken(user.token)
  }

  const handleLogin = (userData) => {
    login(userData)
    queryClient.invalidateQueries(['blogs'])
  }

  const handleLogout = () => {
    logout()
    queryClient.invalidateQueries(['blogs'])
  }

  return (
    <NotificationProvider>
      <div>
        <Navigation user={user} handleLogout={handleLogout} />
        <Notification />
        
        <Routes>
          <Route path="/" element={
            user ? (
              <div>
                <BlogForm />
                <BlogList />
              </div>
            ) : (
              <div>
                <h2>Blog App</h2>
                <p>Please log in to view blogs</p>
              </div>
            )
          } />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        </Routes>
      </div>
    </NotificationProvider>
  )
}

export default App