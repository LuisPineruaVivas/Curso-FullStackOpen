import { Alert } from "@mui/material";
import { useSelector } from "react-redux";

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  return (
    notification.length > 0 && (
      <Alert severity={notification[0].type}>{notification[0].message}</Alert>
    )
  );
};

export default Notification;
