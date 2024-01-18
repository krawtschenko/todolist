import {RootState} from "app/store";

export const selectTasksSlice = {
	tasks: (state: RootState) => state.tasksSlice,
};