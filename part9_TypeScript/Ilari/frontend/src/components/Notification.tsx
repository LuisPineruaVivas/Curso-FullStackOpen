interface NotificationProps {
    message: string | null;
}

const Notification = (props: NotificationProps) => {
  return (
    <>
      {props.message && <div style={{color: 'red'}}>{props.message}</div>}
    </>
  )
}

export default Notification
