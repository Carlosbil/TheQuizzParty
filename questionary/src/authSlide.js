import { createSlice } from "@reduxjs/toolkit";

export function getCookieValue(name) {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}


const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      // Eliminar cookie en el lado del cliente:
      document.cookie = "isAuthenticated=False; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
