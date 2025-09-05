// backend/index.js
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

let users = [
  {
    id: "1",
    username: "testuser",
    name: "Test User",
    password: "testpass"
  }
]

let blogs = []
let tokens = {}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username && u.password === password)
  
  if (user) {
    const token = Math.random().toString(36).substring(2)
    tokens[token] = user.id
    res.json({ token, username: user.username, name: user.name })
  } else {
    res.status(401).json({ error: 'invalid username or password' })
  }
})

// Get all blogs
app.get('/api/blogs', (req, res) => {
  res.json(blogs)
})

// Create a new blog
app.post('/api/blogs', (req, res) => {
  const token = req.headers.authorization
  if (!token || !tokens[token]) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  
  const blog = {
    id: Math.random().toString(36).substring(2),
    ...req.body,
    user: tokens[token],
    likes: 0
  }
  
  blogs.push(blog)
  res.status(201).json(blog)
})

// Update blog likes
app.put('/api/blogs/:id', (req, res) => {
  const blog = blogs.find(b => b.id === req.params.id)
  if (blog) {
    blog.likes = req.body.likes
    res.json(blog)
  } else {
    res.status(404).json({ error: 'blog not found' })
  }
})

// Delete a blog
app.delete('/api/blogs/:id', (req, res) => {
  const token = req.headers.authorization
  if (!token || !tokens[token]) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  
  const blogIndex = blogs.findIndex(b => b.id === req.params.id)
  if (blogIndex === -1) {
    return res.status(404).json({ error: 'blog not found' })
  }
  
  if (blogs[blogIndex].user !== tokens[token]) {
    return res.status(403).json({ error: 'only the creator can delete a blog' })
  }
  
  blogs.splice(blogIndex, 1)
  res.status(204).end()
})

// Reset endpoint for testing
app.post('/api/testing/reset', (req, res) => {
  blogs = []
  users = [
    {
      id: "1",
      username: "testuser",
      name: "Test User",
      password: "testpass"
    }
  ]
  tokens = {}
  res.status(204).end()
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})