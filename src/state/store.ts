import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "./tasksReducer/tasksReducer";
import { todoListsReducer } from "./todoListsReducer/todoListsReducer";
import { appReducer } from "./appReducer/app-reducer";
import { authReducer } from "./authReducer/authReducer";
import { ThunkDispatch, thunk } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

// // определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;

// Типизация Thunk
export type thunkDispatchType = ThunkDispatch<
  AppRootStateType,
  unknown,
  // или все наши Actions или AnyAction
  AnyAction
>;

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch<thunkDispatchType>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;
