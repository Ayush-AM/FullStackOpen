// src/components/Notification.jsx
const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: '#f0f0f0'
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification