import { useDispatch } from "react-redux";
import { useState } from "react";
import { create } from "../reducers/blogsReducer";
import { Button, TextField } from "@mui/material";

const BlogForm = ({ blogFormRef }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    dispatch(create(blogObject));
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField 
            name="Title" 
            placeholder="Title"
            label="Title"
            value={title} 
            size="small"
            onChange={({ target }) => setTitle(target.value)} 
            sx={{ padding: 1 }}
          />
        </div>
        <div>
          <TextField 
            name="Author" 
            placeholder="Author"
            label="Author"
            value={author} 
            size="small"
            onChange={({ target }) => setAuthor(target.value)} 
            sx={{ padding: 1 }}
          />
        </div>
        <div>
          <TextField 
            name="Url" 
            placeholder="Url"
            label="Url"
            value={url} 
            size="small"
            onChange={({ target }) => setUrl(target.value)} 
            sx={{ padding: 1 }}
          />
        </div>
        <Button type="submit" variant="contained" sx={{ margin: 1 }}>Create</Button>
      </form>
    </div>
  );
};

export default BlogForm;
