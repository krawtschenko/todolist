import { Action, configureStore } from "@reduxjs/toolkit";
import tasksSlice from "./tasksReducer/tasksReducer";
import todoListsSlice from "./todoListsReducer/todoListsReducer";
import appSlice from "./appReducer/app-reducer";
import authSlice from "./authReducer/authReducer";
import { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action>;

export const store = configureStore({
  reducer: { tasksSlice, todoListsSlice, appSlice, authSlice },
});

export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
