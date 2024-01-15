import { ITasksStateType, tasksReducer } from "./tasksSlice/tasksSlice";
import { ITodoListDomain, todoListsActions, todoListsReducer } from "./todoListsSlice/todoListsSlice";

const newTodoList = { id: "todoListId3", addedDate: new Date(), order: 1, title: "new todoList" };

test("ids should be equals", () => {
  const startTasksState: ITasksStateType = {};
  const startTodoListsState: ITodoListDomain[] = [];

  const action = todoListsActions.addTodoListAC(newTodoList);

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodoListsState = todoListsReducer(startTodoListsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodoLists = endTodoListsState[0].id;

  expect(idFromTasks).toBe(action.payload.id);
  expect(idFromTodoLists).toBe(action.payload.id);
});
