import { Link } from "react-router-dom";
import blogService from "../services/blogs";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../reducers/userReducer";
import { clearBlogs } from "../reducers/blogsReducer";
import { setNotification } from "../reducers/notificationReducer";
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box
} from '@mui/material'

const Menu = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const padding = {
    paddingRight: 5,
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(clearUser());
    dispatch(clearBlogs());
    dispatch(setNotification({ message: `Logged out`, type: "success" }, 5));
    blogService.setToken(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit" component={Link} to="/blogs">
            Blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
            Users
        </Button>
          <Typography variant="p" style={padding}>
            Logged in as {user.name}
          </Typography>
          <Button color="inherit" sx={{ marginLeft: 'auto' }} onClick={handleLogout}>
            logout
          </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
