import { useState } from "react";
import { useNotificationDispatch } from "../hooks/notificationContext";
import { useUserDispatch } from "../hooks/userContext";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { useNavigate } from "react-router-dom"
import { Form, Button, FormGroup } from 'react-bootstrap'

const LoginForm = () => {
  const Navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const notificationDispatch = useNotificationDispatch();
  const userDispatch = useUserDispatch();


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      userDispatch({
        type: "SET",
        payload: user
      });
      setUsername("");
      setPassword("");
      notificationDispatch({
        type: "SET",
        payload: {
          message: `Welcome ${user.name}`,
          type: "success",
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 5000);
      Navigate("/blogs")
    } catch (exception) {
      notificationDispatch({
        type: "SET",
        payload: {
          message: "Wrong credentials",
          type: "danger",
        },
      });
      setTimeout(() => {
        notificationDispatch({ type: "CLEAR" });
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <Form onSubmit={handleLogin}>
        <FormGroup>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            data-testid="username"
          />
        </FormGroup>
        <FormGroup>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            data-testid="password"
          />
        </FormGroup>
        <Button  variant="primary" type="submit">login</Button>
      </Form>
    </div>
  );
};


export default LoginForm;
