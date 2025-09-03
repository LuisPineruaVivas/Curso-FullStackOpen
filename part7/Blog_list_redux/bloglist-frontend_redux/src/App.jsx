import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Blogs_view from "./views/Blogs_view";
import Users_view from "./views/Users_view";
import User_view from "./views/User_view";
import Blog_view from "./views/Blog_view";
import LoginForm from "./components/LoginForm";

import Notification from "./components/Notification";
import { setUser } from "./reducers/userReducer";
import { initializeBlogs, setToken } from "./reducers/blogsReducer";
import Menu from "./components/Menu";
import { Container } from '@mui/material'

const App = () => {
  const dispatch = useDispatch();

  const notification = useSelector((state) => state.notification);
  const userRedux = useSelector((state) => state.user);

  useEffect(() => {
    if (userRedux) {
      dispatch(initializeBlogs());
    }
  }, [userRedux]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setToken(user.token));
      dispatch(setUser(user));
    }
  }, []);

  if (!userRedux) {
    return (
      <div>
        <h1>BLOGS APP</h1>
        <Notification />
        <LoginForm />
      </div>
    );
  }

  return (
    <Container>
      <Menu />
      <Notification message={notification.message} type={notification.type} />
      <Routes>
        <Route path="/" element={<Blogs_view />} />
        <Route path="/blogs" element={<Blogs_view />} />
        <Route path="/users" element={<Users_view />} />
        <Route path="/users/:id" element={<User_view />} />
        <Route path="/blogs/:id" element={<Blog_view />} />
      </Routes>
    </Container>
  );
};

export default App;
