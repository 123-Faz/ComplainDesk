import { configureStore } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import authReducer from "./authSlice";
import authAdminReducer from "./authAdminSlice";

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    auth: authReducer,
    auth_admin: authAdminReducer,

  },
});


