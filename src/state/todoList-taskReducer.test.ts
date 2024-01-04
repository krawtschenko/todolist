import tasksReducer, { ITasksStateType } from "./tasksReducer/tasksReducer";
import todoListsReducer, { ITodoListDomain, addTodoListAC } from "./todoListsReducer/todoListsReducer";

const newTodoList = { id: "todoListId3", addedDate: new Date(), order: 1, title: "new todoList" };

test("ids should be equals", () => {
  const startTasksState: ITasksStateType = {};
  const startTodoListsState: ITodoListDomain[] = [];

  const action = addTodoListAC(newTodoList);

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodoListsState = todoListsReducer(startTodoListsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodoLists = endTodoListsState[0].id;

  expect(idFromTasks).toBe(action.payload.id);
  expect(idFromTodoLists).toBe(action.payload.id);
});
