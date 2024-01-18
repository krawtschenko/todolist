import {RootState} from "app/store";

export const selectTodoListsSlice = {
	todoLists: (state: RootState) => state.todoListsSlice,
};