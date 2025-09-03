import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setNotification } from "./notificationReducer";
import { clearUser } from "./userReducer";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogsToken(state, action) {
      const token = action.payload;
      blogService.setToken(token);
    },
    likeBlog(state, action) {
      const id = action.payload;
      const blogToChange = state.find((b) => b.id === id);
      const changedBlog = { ...blogToChange, likes: blogToChange.likes + 1 };
      return state.map((blog) => (blog.id !== id ? blog : changedBlog));
    },
    appendComment(state, action) {
      const id = action.payload.id;
      const blogToChange = state.find((b) => b.id === id);
      const changedBlog = {
        ...blogToChange,
        comments: blogToChange.comments.concat(action.payload.comment),
      };
      return state.map((blog) => (blog.id !== id ? blog : changedBlog));
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
    setBlogs(state, action) {
      return action.payload;
    },
  },
});

export const {
  likeBlog,
  appendComment,
  setBlogs,
  appendBlog,
  removeBlog,
  setBlogsToken,
} = blogSlice.actions;

export const setToken = (token) => {
  return async (dispatch) => {
    dispatch(setBlogsToken(token));
  };
};

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll();
      dispatch(setBlogs(blogs));
    } catch (exception) {
      if (!handleTokenExpired(exception, dispatch)) {
        dispatch(
          setNotification({ message: exception.message, type: "error" }, 5),
        );
      }
    }
  };
};

export const create = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(content);
      dispatch(appendBlog(newBlog));
      dispatch(
        setNotification(
          {
            message: `a new blog "${newBlog.title}" by "${newBlog.author}" added`,
            type: "success",
          },
          5,
        ),
      );
    } catch (exception) {
      dispatch(
        setNotification(
          { message: `Error adding blog ${exception.message}`, type: "error" },
          5,
        ),
      );
    }
  };
};

export const like = (id, blog) => {
  return async (dispatch) => {
    try {
      await blogService.update(id, { ...blog, likes: blog.likes + 1 });
      dispatch(likeBlog(id));
      dispatch(
        setNotification(
          { message: `you liked "${blog.title}"`, type: "success" },
          5,
        ),
      );
    } catch (exception) {
      dispatch(
        setNotification(
          { message: `Error liking blog ${exception.message}`, type: "error" },
          5,
        ),
      );
    }
  };
};

export const addComment = (id, blog) => {
  return async (dispatch) => {
    try {
      await blogService.addComment(id, blog);
      dispatch(appendComment({ id, comment: blog.comment }));
      dispatch(
        setNotification({ message: `Added comment`, type: "success" }, 5),
      );
    } catch (exception) {
      dispatch(
        setNotification(
          {
            message: `Error commenting blog ${exception.message}`,
            type: "error",
          },
          5,
        ),
      );
    }
  };
};

export const remove = (id) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id);
      dispatch(removeBlog(id));
      dispatch(
        setNotification({ message: `blog removed`, type: "success" }, 5),
      );
    } catch (exception) {
      dispatch(
        setNotification(
          {
            message: `Error removing blog ${exception.message}`,
            type: "error",
          },
          5,
        ),
      );
    }
  };
};

export const clearBlogs = () => {
  return async (dispatch) => {
    dispatch(setBlogs([]));
  };
};

const handleTokenExpired = (error, dispatch) => {
  if (
    error.response &&
    error.response.status === 401 &&
    error.response.data.error === "token expired"
  ) {
    console.log("Token expired");
    window.localStorage.removeItem("loggedBlogappUser");
    dispatch(clearUser());
    dispatch(
      setNotification(
        { message: "Session expired, please log in again", type: "error" },
        5,
      ),
    );
    return true;
  }
  return false;
};

export default blogSlice.reducer;
