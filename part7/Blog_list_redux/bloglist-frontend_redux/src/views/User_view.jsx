import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import userService from "../services/user";
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const User_view = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getById(id).then((user) => {
      setUser(user);
    });
  }, [id]);

  if (!user) {
    return null;
  }

  return (
      <Card sx={{ maxWidth: 345, boxShadow: 'lg' }}>
        <CardContent>
          <Avatar src="/static/images/avatar/1.jpg" sx={{ '--Avatar-size': '4rem', mx: 'auto'}} />
          <Typography level="title-lg" sx={{textAlign: 'center'}}>{user.name}</Typography>
            <List key={user.id} sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <Typography level="title-lg">Added Blogs</Typography>
              {user.blogs.map((blog, index) => (
                    <ListItem key={index} alignItems="flex-start" sx={{width: '100%'}}>
                      <ListItemText sx={{width: '100%'}}
                        primary={ <React.Fragment>
                                  <span style={{ marginRight: 8 }}>&#8226;</span> {/* add a bullet point marker */}
                                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                                </React.Fragment>}
                      />
                    </ListItem>
              ))}
              </List>
        </CardContent>
      </Card>
  );
};
export default User_view;






