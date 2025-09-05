// src/hooks/useUser.js
import { useState } from 'react'

export const useUser = () => {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    setUser(userData)
    window.localStorage.setItem('loggedBlogUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogUser')
  }

  return { user, login, logout }
}