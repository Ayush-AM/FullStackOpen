// frontend/src/App.jsx
import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {
  if (!message) return null
  
  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  )
}

const LoginForm = ({ handleLogin, username, setUsername, password, setPassword }) => (
  <form onSubmit={handleLogin}>
    <div>
      <label htmlFor="username">Username:</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
    </div>
    <div>
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
    </div>
    <button id="login-button" type="submit">Login</button>
  </form>
)

const BlogForm = ({ createBlog, title, setTitle, author, setAuthor, url, setUrl }) => (
  <form onSubmit={createBlog}>
    <div>
      <label htmlFor="title">Title:</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={({ target }) => setTitle(target.value)}
      />
    </div>
    <div>
      <label htmlFor="author">Author:</label>
      <input
        id="author"
        type="text"
        value={author}
        onChange={({ target }) => setAuthor(target.value)}
      />
    </div>
    <div>
      <label htmlFor="url">URL:</label>
      <input
        id="url"
        type="text"
        value={url}
        onChange={({ target }) => setUrl(target.value)}
      />
    </div>
    <button id="create-blog-button" type="submit">Create</button>
  </form>
)

const Blog = ({ blog, user, handleLike, handleDelete }) => (
  <div className="blog">
    <div>
      {blog.title} by {blog.author}
      <button onClick={() => handleLike(blog)}>Like</button>
      {blog.user === user.id && (
        <button onClick={() => handleDelete(blog)}>Delete</button>
      )}
      <div>Likes: {blog.likes}</div>
    </div>
  </div>
)

function App() {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })
  const [showBlogForm, setShowBlogForm] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification({ message: 'Login successful', type: 'success' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    } catch (exception) {
      setNotification({ message: 'Wrong credentials', type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const createBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({ title, author, url })
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setShowBlogForm(false)
      setNotification({ message: `A new blog ${newBlog.title} by ${newBlog.author} added`, type: 'success' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    } catch (exception) {
      setNotification({ message: 'Failed to create blog', type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
      setBlogs(blogs.map(b => b.id === blog.id ? updatedBlog : b))
    } catch (exception) {
      setNotification({ message: 'Failed to like blog', type: 'error' })
      setTimeout(() => setNotification({ message: null, type: null }), 5000)
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setNotification({ message: 'Blog deleted successfully', type: 'success' })
        setTimeout(() => setNotification({ message: null, type: null }), 5000)
      } catch (exception) {
        setNotification({ message: 'Failed to delete blog', type: 'error' })
        setTimeout(() => setNotification({ message: null, type: null }), 5000)
      }
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification.message} type={notification.type} />
        <LoginForm 
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification.message} type={notification.type} />
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>Logout</button>
      </div>
      <br />
      {showBlogForm ? (
        <div>
          <h3>Create new</h3>
          <BlogForm 
            createBlog={createBlog}
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            url={url}
            setUrl={setUrl}
          />
          <button onClick={() => setShowBlogForm(false)}>Cancel</button>
        </div>
      ) : (
        <button id="new-blog-button" onClick={() => setShowBlogForm(true)}>New blog</button>
      )}
      <br />
      <br />
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog 
            key={blog.id} 
            blog={blog} 
            user={user}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </div>
  )
}

export default App