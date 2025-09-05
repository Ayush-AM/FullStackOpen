// src/components/CreateNew.jsx
import { useField, getInputProps } from '../hooks'

const CreateNew = ({ addNew }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    // 7.5: Reset fields after submit
    content.reset()
    author.reset()
    info.reset()
  }

  // 7.5: Reset all fields
  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...getInputProps(content)} />
        </div>
        <div>
          author
          <input {...getInputProps(author)} />
        </div>
        <div>
          url for more info
          <input {...getInputProps(info)} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew