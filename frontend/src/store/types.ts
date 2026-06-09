// types.ts
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { store } from "./index";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;