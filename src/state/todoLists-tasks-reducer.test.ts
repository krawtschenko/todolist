import {tasksReducer} from "./tasks-reducer";
import {TasksStateType, TodoListType} from "../components/app/App";
import {addTodoList, todoListsReducer} from "./todo-lists-reducer";

test('ids should be equals', () => {
	const startTasksState: TasksStateType = {};
	const startTodoListsState: Array<TodoListType> = [];

	const action = addTodoList("new todolist");

	const endTasksState = tasksReducer(startTasksState, action)
	const endTodoListsState = todoListsReducer(startTodoListsState, action)

	const keys = Object.keys(endTasksState);
	const idFromTasks = keys[0];
	const idFromTodoLists = endTodoListsState[0].id;

	expect(idFromTasks).toBe(action.payload.todoListId);
	expect(idFromTodoLists).toBe(action.payload.todoListId);
});