import { AnyAction, combineReducers, configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksReducer/tasksReducer";
import todoListsReducer from "./todoListsReducer/todoListsReducer";
import appReducer from "./appReducer/app-reducer";
import authReducer from "./authReducer/authReducer";
import { ThunkDispatch, thunk } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export type AppRootStateType = ReturnType<typeof rootReducer>;
export type thunkDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>; // или все наши Actions или AnyAction

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
});

export const useAppDispatch = useDispatch<thunkDispatchType>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;
