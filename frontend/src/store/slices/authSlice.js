import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isAuthenticated: !!Cookies.get("token"),
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    logIn: (state) => {
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.isAuthenticated = false;
    },
    checkAuth: (state) => {
      state.isAuthenticated = !!Cookies.get("token");
    },
  },
});

export default authSlice.reducer;
export const { logIn, logOut, checkAuth } = authSlice.actions;
