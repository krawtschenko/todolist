import { Action, configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksReducer/tasksReducer";
import todoListsReducer from "./todoListsReducer/todoListsReducer";
import appReducer from "./appReducer/app-reducer";
import authReducer from "./authReducer/authReducer";
import { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, Action>;

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
  },
});

export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;
