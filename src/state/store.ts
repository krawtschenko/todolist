import { Action, configureStore } from "@reduxjs/toolkit";
import { tasksSlice } from "./tasksSlice/tasksSlice";
import { todoListsSlice } from "./todoListsSlice/todoListsSlice";
import appSlice from "./appSlice/appSlice";
import authSlice from "./authSlice/authSlice";
import { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action>;

export const store = configureStore({
  reducer: { tasksSlice, todoListsSlice, appSlice, authSlice },
});

export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
