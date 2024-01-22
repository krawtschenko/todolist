import {Action, configureStore} from "@reduxjs/toolkit";
import {tasksSlice} from "features/tasks/model/tasksSlice";
import {todoListsSlice} from "features/todoLists/model/todoListsSlice";
import {ThunkDispatch} from "redux-thunk";
import {appSlice} from "app/model/appSlice";
import {authSlice} from "features/auth/model/authSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, unknown, Action>;

export const store = configureStore({
	reducer: {tasks: tasksSlice, todoLists: todoListsSlice, app: appSlice, auth: authSlice},
});
