import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isAuthenticated: !!Cookies.get("userAccess"),
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
      Cookies.remove("userAccess");
    },
    checkAuth: (state) => {
      state.isAuthenticated = !!Cookies.get("userAccess");
    },
  },
});

export default authSlice.reducer;
export const { logIn, logOut, checkAuth } = authSlice.actions;
