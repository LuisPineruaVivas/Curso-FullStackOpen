import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../reducers/blogsReducer";
import { Button, TextField } from "@mui/material";

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    const body = {
      comment: comment,
    };
    dispatch(addComment(blogId, body));
    setComment("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField 
            name="comment" 
            placeholder="Send a comment"
            label="Comments"
            value={comment} 
            size="small"
            onChange={({ target }) => setComment(target.value)} 
          />
          <Button type="submit" variant="contained" >Add Comment</Button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
