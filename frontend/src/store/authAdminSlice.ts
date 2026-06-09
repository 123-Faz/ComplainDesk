import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./types";
import Cookies from "js-cookie";

interface AdminI {
  email: string;
  id: number;
  role: string;
  username: string;
}

interface AuthAdminState {
  user: AdminI | null;
  token: string | undefined;
}

// restore user from localStorage if available
const savedUser = localStorage.getItem("admin_user");

const initialState: AuthAdminState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: Cookies.get("admin_token"),
};

export const authAdminSlice = createSlice({
  name: "auth_admin",
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      console.log("🔑 Admin login payload in slice:", action.payload);

      state.user = action.payload.user;
      state.token = action.payload.access_token;

      Cookies.set("admin_token", action.payload.access_token, {
        expires: 1,
        secure: import.meta.env.VITE_NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      localStorage.setItem("admin_user", JSON.stringify(action.payload.user));

      console.log("✅ Token saved in Redux:", state.token);
      console.log("✅ Token saved in cookie:", Cookies.get("admin_token"));
    },

    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("admin_user", JSON.stringify(action.payload));
    },

    adminLogout: (state) => {
      state.user = null;
      state.token = undefined;
      Cookies.remove("admin_token", { path: "/" });
      localStorage.removeItem("admin_user");
    },
  },
});

export const { setUser, setAdminCredentials, adminLogout } = authAdminSlice.actions;

// ✅ selectors
export const getAdmin = (state: RootState) => state.auth_admin.user;
export const getAuthAdminToken = (state: RootState) => state.auth_admin.token;

export default authAdminSlice.reducer;
