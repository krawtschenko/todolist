import { ITasksStateType, tasksReducer } from "../tasksReducer/tasksReducer";
import {
  ITodoListDomain,
  addTodoListAC,
  todoListsReducer,
} from "./todoListsReducer";

test("ids should be equals", () => {
  const startTasksState: ITasksStateType = {};
  const startTodoListsState: ITodoListDomain[] = [];

  const action = addTodoListAC("new todoList");

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodoListsState = todoListsReducer(startTodoListsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodoLists = endTodoListsState[0].id;

  expect(idFromTasks).toBe(action.payload.todoListId);
  expect(idFromTodoLists).toBe(action.payload.todoListId);
});
