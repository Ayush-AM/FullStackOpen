// src/components/CommentForm.jsx
import { useState } from 'react'

const CommentForm = ({ onSubmit }) => {
  const [comment, setComment] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(comment)
    setComment('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={comment}
        onChange={({ target }) => setComment(target.value)}
        placeholder="Add a comment..."
      />
      <button type="submit">add comment</button>
    </form>
  )
}

export default CommentForm