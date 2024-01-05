import { Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksReducer/tasksReducer";
import todoListsReducer from "./todoListsReducer/todoListsReducer";
import appReducer from "./appReducer/app-reducer";
import authReducer from "./authReducer/authReducer";
import { ThunkDispatch, thunk } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// export type AppRootStateType = ReturnType<typeof rootReducer>;
export type AppRootStateType = ReturnType<typeof store.getState>;
export type ThunkDispatchType = ThunkDispatch<AppRootStateType, unknown, Action>;

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({ reducer: rootReducer });

export const useAppDispatch = useDispatch<ThunkDispatchType>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;
