import { useEffect } from "react";
import { useUserValue, useUserDispatch } from "./hooks/userContext";
import {
  Routes,
  Route
} from "react-router-dom"

import blogService from "./services/blogs";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Menu from "./components/Menu";
import Blogs_view from "./views/Blogs_view";
import Users_view from "./views/Users_view";
import User_view from "./views/User_view";
import Blog_view from "./views/Blog_view";


const App = () => {
  const user = useUserValue();
  const userDispatch = useUserDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: "SET", payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  if (!user) {
    return (
      <div className="container">
        <h1>BLOGS APP</h1>
        <Notification />
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="container">
      <Menu user={user} />
        <Notification />
      {user && (
        <Routes>
          <Route path="/" element={<Blogs_view />} />
          <Route path="/blogs" element={<Blogs_view />} />
          <Route path="/users" element={<Users_view />} />
          <Route path="/users/:id" element={<User_view />} />
          <Route path="/blogs/:id" element={<Blog_view/>} />
        </Routes>
      )}
    </div>
  );
};

export default App;
