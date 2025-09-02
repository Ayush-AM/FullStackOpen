const Notification = ({ message, type }) => {
  if (message === null) return null

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: '#f2f2f2',
    fontSize: 20,
    border: '2px solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  }

  return <div style={notificationStyle}>{message}</div>
}

export default Notification
