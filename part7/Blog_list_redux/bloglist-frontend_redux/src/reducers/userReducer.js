import { createSlice } from "@reduxjs/toolkit";
import { setNotification } from "./notificationReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUserData(state, action) {
      return action.payload;
    },
    clearUserData() {
      return null;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export const setUser = (data) => {
  return async (dispatch) => {
    dispatch(setUserData(data));
    dispatch(
      setNotification({ message: `Welcome ${data.name}`, type: "success" }, 5),
    );
  };
};

export const clearUser = () => {
  return (dispatch) => {
    dispatch(clearUserData());
  };
};

export default userSlice.reducer;
