import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [showDetails, setShowDetails] = useState(false) // 5.7: Toggle details

  // 5.7: Blog style
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // 5.8: Handle like
  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user // 5.9: Ensure user reference is correct
    }
    await updateBlog(blog.id, updatedBlog)
  }

  // 5.11: Handle delete with confirmation
  const handleDelete = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      await deleteBlog(blog.id)
    }
  }

  // 5.11: Check if current user is the blog creator
  const showDeleteButton = blog.user && currentUser && 
    (blog.user.username === currentUser.username || 
     blog.user.id === currentUser.id)

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} by {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      
      {showDetails && (
        <div className="blog-details">
          <div>{blog.url}</div>
          <div>
            likes: {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>
            {/* 5.9: Display user name correctly */}
            {blog.user && blog.user.name && `added by ${blog.user.name}`}
          </div>
          {/* 5.11: Delete button only for blog owner */}
          {showDeleteButton && (
            <button onClick={handleDelete} style={{ background: 'red', color: 'white' }}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog