import { configureStore } from "@reduxjs/toolkit";

import notificationReducer from "./reducers/notificationReducer";
import loginReducer from "./reducers/userReducer";
import blogsReducer from "./reducers/blogsReducer";

const store = configureStore({
  reducer: {
    user: loginReducer,
    blogs: blogsReducer,
    notification: notificationReducer,
  },
});

export default store;
