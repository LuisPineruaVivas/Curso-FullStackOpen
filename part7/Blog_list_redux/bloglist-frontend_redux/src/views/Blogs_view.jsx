import Togglable from "../components/Togglable";
import BlogForm from "../components/BlogForm";
import BlogList from "../components/BlogList";
import { useRef } from "react";
import blogService from "../services/blogs";
import { Container } from '@mui/material';

const Blogs_view = () => {
  const blogFormRef = useRef();

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(clearUser());
    dispatch(clearBlogs());
    dispatch(setNotification({ message: `Logged out`, type: "success" }, 5));
    blogService.setToken(null);
  };

  return (
    <Container>
      <h2>BLOGS</h2>
      <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
      <br />
      <BlogList handleLogout={handleLogout} />
    </Container>
  );
};

export default Blogs_view;
