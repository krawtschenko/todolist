import {
  ITasksStateType,
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
} from "./tasksReducer";
import { removeTodoListAC } from "../todoListsReducer/todoListsReducer";
import { TaskPriorities, TaskStatuses } from "../../api/api";

let startState: ITasksStateType = {};
const date = new Date();

beforeEach(() => {
  startState = {
    todoListId1: [
      {
        description: "",
        title: "CSS",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "1",
        todoListId: "todoListId1",
        order: 0,
        addedDate: date,
      },
      {
        description: "",
        title: "JS",
        completed: true,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "2",
        todoListId: "todoListId1",
        order: 0,
        addedDate: date,
      },
      {
        description: "",
        title: "React",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "3",
        todoListId: "todoListId1",
        order: 0,
        addedDate: date,
      },
    ],
    todoListId2: [
      {
        description: "",
        title: "bread",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "1",
        todoListId: "todoListId2",
        order: 0,
        addedDate: date,
      },
      {
        description: "",
        title: "milk",
        completed: true,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "2",
        todoListId: "todoListId2",
        order: 0,
        addedDate: date,
      },
      {
        description: "",
        title: "tea",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "3",
        todoListId: "todoListId2",
        order: 0,
        addedDate: date,
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const action = removeTaskAC("2", "todoListId2");

  const endState = tasksReducer(startState, action);
  expect(endState).toEqual({
    todoListId1: [
      {
        description: "",
        title: "CSS",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "1",
        todoListId: "todoListId1",
        order: 0,
        addedDate: date,
      },
      {
        description: "",
        title: "JS",
        completed: true,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "2",
        todoListId: "todoListId1",
        order: 0,
        addedDate: date,
      },
      {
        description: "",
        title: "React",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "3",
        todoListId: "todoListId1",
        order: 0,
        addedDate: date,
      },
    ],
    todoListId2: [
      {
        description: "",
        title: "bread",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "1",
        todoListId: "todoListId2",
        order: 0,
        addedDate: date,
      },
      {
        description: "",
        title: "tea",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "3",
        todoListId: "todoListId2",
        order: 0,
        addedDate: date,
      },
    ],
  });
});

test("correct task should be added to correct array", () => {
  const action = addTaskAC("todoListId2", "juice");

  const endState = tasksReducer(startState, action);

  expect(endState["todoListId1"].length).toBe(3);
  expect(endState["todoListId2"].length).toBe(4);
  expect(endState["todoListId2"][0].id).toBeDefined();
  expect(endState["todoListId2"][0].title).toBe("juice");
  expect(endState["todoListId2"][0].completed).toBe(false);
});

test("status of specified task should be changed", () => {
  const action = changeTaskStatusAC("2", "todoListId2", true);

  const endState = tasksReducer(startState, action);

  expect(endState["todoListId1"][0].completed).toBe(false);
  expect(endState["todoListId2"][1].completed).toBe(true);
});

test("title of specified task should be changed", () => {
  const action = changeTaskTitleAC("2", "todoListId2", "test");

  const endState = tasksReducer(startState, action);

  expect(endState["todoListId1"][0].title).toBe("CSS");
  expect(endState["todoListId2"][1].title).toBe("test");
});

test("property with todoListId1 should be deleted", () => {
  const action = removeTodoListAC("todoListId2");

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todoListId2"]).not.toBeDefined();
});
