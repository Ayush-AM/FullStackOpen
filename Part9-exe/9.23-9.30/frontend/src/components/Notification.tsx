interface NotificationProps {
  message: string;
  type: 'error' | 'success';
}

const Notification = ({ message, type }: NotificationProps) => {
  const style = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  };

  return (
    <div style={style}>
      {message}
    </div>
  );
};

export default Notification;