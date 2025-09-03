import { Alert } from "react-bootstrap";
import { useNotificationValue } from "../hooks/notificationContext";

const Notification = () => {
  const notification = useNotificationValue();
  if (!notification || !notification.message) return null;

  return (
    <Alert variant={notification.type}>{notification.message}</Alert>
  );
};

export default Notification;
