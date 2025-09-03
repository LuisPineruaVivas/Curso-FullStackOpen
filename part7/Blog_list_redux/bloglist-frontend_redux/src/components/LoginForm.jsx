import { useState } from "react";
import { useDispatch } from "react-redux";
import { setNotification } from "../reducers/notificationReducer";
import loginService from "../services/login";
import { setUser } from "../reducers/userReducer";
import { setToken } from "../reducers/blogsReducer";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

const LoginForm = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      dispatch(setToken(user.token));
      setUsername("");
      setPassword("");
      dispatch(setUser(user));
      Navigate("/blogs");
      dispatch(
        setNotification(
          { message: `Welcome ${user.name}`, type: "success" },
          5,
        ),
      );
    } catch (exception) {
      dispatch(
        setNotification(
          {
            message: `Error logging ${exception.status === 401 ? "invalid credentials" : exception.message}`,
            type: "error",
          },
          5,
        ),
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <TextField 
            name="username" 
            placeholder="Username"
            label="Username"
            value={username} 
            size="small"
            onChange={({ target }) => setUsername(target.value)}
            data-testid="username" 
            sx={{ padding: 1 }}
          />
        </div>
        <div>
          <TextField 
            name="password" 
            placeholder="Password"
            label="Password"
            type="password"
            value={password} 
            size="small"
            onChange={({ target }) => setPassword(target.value)}
            data-testid="password" 
            sx={{ padding: 1 }}
          />
        </div>
        <Button type="submit" variant="contained" sx={{ margin: 1 }}>Login</Button>
      </form>
    </div>
  );
};

export default LoginForm;
