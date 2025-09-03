import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNotificationDispatch } from "../hooks/notificationContext";
import blogService from "../services/blogs";
import { Form, Button, FormGroup } from 'react-bootstrap'

const BlogForm = ({ blogFormRef }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

   const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();


  const addBlogMutation = useMutation({
    mutationFn: (blog) => blogService.create(blog),
    onSuccess: (newBlog) => {
      queryClient.setQueryData(["blogs"], (old) => [...old, newBlog]);
      notificationDispatch({
        type: "SET",
        payload: {
          message: `a new blog "${newBlog.title}" by ${newBlog.author} added`,
          type: "success",
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 5000);
    },
    onError: (error) => {
      notificationDispatch({
        type: "SET",
        payload: {
          message: `Error adding blog: ${error.message}`,
          type: "error",
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 5000);
    },
  });

  const addBlog = (event) => {
    event.preventDefault();
    addBlogMutation.mutate({
      title,
      author,
      url,
    });
    setTitle("");
    setAuthor("");
    setUrl("");
    blogFormRef.current.toggleVisibility();
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <Form onSubmit={addBlog}>
        <FormGroup>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Form.Label>Url</Form.Label>
          <Form.Control
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </FormGroup>
        <Button  variant="primary" type="submit">Create</Button>
      </Form>  
    </div>
  );
};

export default BlogForm;
