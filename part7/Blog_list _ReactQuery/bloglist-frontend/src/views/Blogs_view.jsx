import { useUserValue, useUserDispatch } from "../hooks/userContext";
import Togglable from "../components/Togglable";
import BlogForm from "../components/BlogForm";
import BlogList from "../components/BlogList";
import { useRef } from "react";
import blogService from "../services/blogs";

const Blogs_view = () => {
  const blogFormRef = useRef();
  const user = useUserValue();
  const userDispatch = useUserDispatch();

   const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    userDispatch({ type: "CLEAR" });
    blogService.setToken(null);
  };

  return (
    <div>
        <h1>BLOGS</h1>
        <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm blogFormRef={blogFormRef} />
        </Togglable>
        <br />
        <BlogList handleLogout={handleLogout} />
    </div>
  )
}

export default Blogs_view