// src/components/Notification.jsx
import { useNotification } from '../context/NotificationContext'

const Notification = () => {
  const { notification } = useNotification()

  if (!notification) {
    return null
  }

  const style = {
    border: '2px solid',
    borderRadius: '5px',
    padding: '10px',
    margin: '10px 0',
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    color: '#155724'
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification