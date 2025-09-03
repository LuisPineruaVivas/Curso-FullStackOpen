import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNotificationDispatch } from "../hooks/notificationContext";
import blogService from "../services/blogs";
import { Form, Button, FormGroup } from 'react-bootstrap'

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  const notificationDispatch = useNotificationDispatch();

  const addCommentMutation = useMutation({
    mutationFn: (comment) => blogService.addComment(blogId,  comment),
    onSuccess: (updatedBlog) => {
      queryClient.invalidateQueries(["blog"]);
      notificationDispatch({
        type: "SET",
        payload: {
          message: `Comment added`,
          type: "success",
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 5000);
      
    }
  });

  const addBlog = (event) => {
    event.preventDefault();
    const body = {
      comment: comment
    }
    addCommentMutation.mutate(body);
    setComment("");
  };

  return (
    <div>
      <Form onSubmit={addBlog} className="d-flex">
        <FormGroup>
          <Form.Control
            type="text"
            placeholder="Comment"
            value={comment}
            name="comment"
            onChange={({ target }) => setComment(target.value)}
          />
        </FormGroup>
        <Button  variant="primary" className="ms-2" type="submit">Add Comment</Button>
      </Form> 
    </div>
  );
};

export default CommentForm;
