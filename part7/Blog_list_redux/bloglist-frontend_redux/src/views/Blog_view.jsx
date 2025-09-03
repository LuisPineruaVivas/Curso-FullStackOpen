import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CommentForm from "../components/CommentForm";
import { like, remove } from "../reducers/blogsReducer";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

const Blog_view = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const blogs = useSelector((state) => state.blogs);
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id));

  const updateLikes = (id) => {
    const blogToUpdate = blogs.find((b) => b.id === id);
    dispatch(like(id, blogToUpdate));
  };

  const deleteBlog = async (id) => {
    dispatch(remove(id));
    Navigate("/");
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h4" component="div">
          {blog.title}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Author: {blog.author}</Typography>
        <Typography>
          Added by {blog.user.name} <br />
          Check it out at:  <a href="#">{blog.url}</a>
        </Typography>
        <Typography >
          Likes: {blog.likes}{" "}
          <Button size="small" variant="contained" onClick={() => updateLikes(blog.id)}>like</Button>
        </Typography>
      </CardContent>
      <CardContent>
        <Typography variant="h5" component="div">
          Comments
        </Typography>
        <CommentForm blogId={blog.id} />
        <List key={blog.id} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {blog.comments.map((comment, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt="Anonymous" src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment}
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: 'text.primary', display: 'inline' }}
                        >
                          Anonymous
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
          ))}
          </List>
        
      </CardContent>
      <CardActions>
        {blog.user.username === user.username && (
          <Button size="small" variant="contained" sx={{ marginLeft: 'auto' }} color="error" onClick={() => deleteBlog(blog.id)}>delete</Button>
        )}
      </CardActions>
      
    </Card>
  );
};

export default Blog_view;











