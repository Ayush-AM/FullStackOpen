// src/components/Blog.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useNotification } from '../context/NotificationContext'
import blogService from '../services/blogs'
import CommentForm from './CommentForm'

const Blog = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { setNotification } = useNotification()

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getAll().then(blogs => blogs.find(b => b.id === id)),
    enabled: !!id
  })

  const likeMutation = useMutation({
    mutationFn: () => blogService.update(blog.id, { ...blog, likes: blog.likes + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog', id])
      queryClient.invalidateQueries(['blogs'])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: () => blogService.remove(blog.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      setNotification('Blog deleted successfully')
    }
  })

  const commentMutation = useMutation({
    mutationFn: (comment) => blogService.addComment(blog.id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog', id])
    }
  })

  if (isLoading) return <div>Loading blog...</div>
  if (error) return <div>Error loading blog</div>
  if (!blog) return <div>Blog not found</div>

  const handleLike = () => {
    likeMutation.mutate()
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteMutation.mutate()
    }
  }

  const handleComment = (comment) => {
    commentMutation.mutate(comment)
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>by {blog.author}</p>
      <p>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
      </p>
      <p>
        {blog.likes} likes
        <button onClick={handleLike} style={{ marginLeft: '10px' }}>like</button>
      </p>
      <p>added by {blog.user?.name}</p>
      <button onClick={handleDelete}>delete</button>

      <h3>comments</h3>
      <CommentForm onSubmit={handleComment} />
      <ul>
        {blog.comments?.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog