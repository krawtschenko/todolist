import { RootState } from "state/store";

export const selectAppSlice = {
  status: (state: RootState) => state.appSlice.status,
  error: (state: RootState) => state.appSlice.error,
  isInitialized: (state: RootState) => state.appSlice.isInitialized,
};

export const selectAuthSlice = {
  isLoggedIn: (state: RootState) => state.authSlice.isLoggedIn,
};

export const selectTasksSlice = {
  tasks: (state: RootState) => state.tasksSlice,
};

export const selectTodoListsSlice = {
  todoLists: (state: RootState) => state.todoListsSlice,
};
