import {ITasksStateType, tasksSlice} from "features/tasks/model/tasksSlice";
import {ITodoListDomain, todoListsActions, todoListsSlice} from "features/todoLists/model/todoListsSlice";

const newTodoList = {id: "todoListId3", addedDate: new Date(), order: 1, title: "new todoLists"};

test("ids should be equals", () => {
	const startTasksState: ITasksStateType = {};
	const startTodoListsState: ITodoListDomain[] = [];

	const action = todoListsActions.createTodoListTC.fulfilled(newTodoList, 'requestId', {title: "new todoLists"});

	const endTasksState = tasksSlice(startTasksState, action);
	const endTodoListsState = todoListsSlice(startTodoListsState, action);

	const keys = Object.keys(endTasksState);
	const idFromTasks = keys[0];
	const idFromTodoLists = endTodoListsState[0].id;

	expect(idFromTasks).toBe(action.payload.id);
	expect(idFromTodoLists).toBe(action.payload.id);
});
