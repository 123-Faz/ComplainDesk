// darkModeSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./types";

interface DarkModeState {
  value: boolean;
}

const getSystemPreference = (): boolean => {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

const getInitialDarkModeValue = (): boolean => {
  if (typeof window === 'undefined') return false; // For SSR
  const storedValue = localStorage.getItem("darkMode");
  if (storedValue !== null) return storedValue === "true";
  return getSystemPreference();
};

const initialState: DarkModeState = {
  value: getInitialDarkModeValue(),
};

export const darkModeSlice = createSlice({
  name: "darkMode",
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
      localStorage.setItem("darkMode", action.payload.toString());
    },
    toggleDarkMode: (state) => {
      state.value = !state.value;
      localStorage.setItem("darkMode", state.value.toString());
      document.documentElement.classList.toggle('dark');
    }
  },
  extraReducers(builder) {
    builder
      .addCase(initDarkMode.fulfilled, (state, action) => {
        state.value = action.payload
      })
  },
});


export const initDarkMode = createAsyncThunk(
  'darkMode/initialize',
  async (_, { dispatch }) => {
    let darkModeValue: boolean;
    const storedValue = localStorage.getItem("darkMode");
    if (storedValue !== null) {
      darkModeValue = storedValue === "true";
      if (darkModeValue === true) {
        document.documentElement.classList.add('dark');
      }
      else {
        document.documentElement.classList.remove('dark');
      }

    } else {
      darkModeValue = getSystemPreference();
      localStorage.setItem("darkMode", darkModeValue.toString());
      if (darkModeValue === true) {
        document.documentElement.classList.add('dark');
      }
      else {
        document.documentElement.classList.remove('dark');
      }

    }
    dispatch(setDarkMode(darkModeValue));
    return darkModeValue;
  }
);

export const { setDarkMode, toggleDarkMode } = darkModeSlice.actions;

export const selectDarkMode = (state: RootState) => state.darkMode.value;

export default darkModeSlice.reducer;