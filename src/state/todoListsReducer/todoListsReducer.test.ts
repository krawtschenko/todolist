import {
  ITodoListDomain,
  addTodoListAC,
  changeTodoListFilterAC,
  changeTodoListTitleAC,
  removeTodoListAC,
  todoListsReducer,
} from "./todoListsReducer";
import { v1 } from "uuid";

let todoListId1 = v1();
let todoListId2 = v1();
let newTodoListTitle = "New Test";
const date = new Date();
let startState: ITodoListDomain[] = [
  { id: todoListId1, title: "What to learn", filter: "all", addedDate: date, order: 1 },
  { id: todoListId2, title: "What to buy", filter: "all", addedDate: date, order: 1 },
];

beforeEach(() => {
  todoListId1 = v1();
  todoListId2 = v1();
  newTodoListTitle = "New Test";
  startState = [
    { id: todoListId1, title: "What to learn", filter: "all", addedDate: date, order: 1 },
    { id: todoListId2, title: "What to buy", filter: "all", addedDate: date, order: 1 },
  ];
});

test("correct todoList should be removed", () => {
  const endState = todoListsReducer(startState, removeTodoListAC(todoListId1));

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todoListId2);
});

test("correct todoList should be added", () => {
  const endState = todoListsReducer(
    startState,
    addTodoListAC(newTodoListTitle)
  );

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodoListTitle);
});

test("correct todoList should change its name", () => {
  const endState = todoListsReducer(
    startState,
    changeTodoListTitleAC(todoListId2, newTodoListTitle)
  );

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodoListTitle);
});

test("correct filter of todoList should be changed", () => {
  const endState = todoListsReducer(
    startState,
    changeTodoListFilterAC(todoListId2, "completed")
  );

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe("completed");
});
