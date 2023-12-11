import {
  ITasksStateType,
  addTaskAC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  removeTaskAC,
  tasksReducer,
} from "./tasksReducer";
import { removeTodoListAC } from "../todoListsReducer/todoListsReducer";
import { TaskPriorities, TaskStatuses } from "../../api/todoList_API";

let startState: ITasksStateType = {};
const date = new Date();

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        description: "",
        title: "CSS",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "1",
        todoListId: "todolistId1",
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
        todoListId: "todolistId1",
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
        todoListId: "todolistId1",
        order: 0,
        addedDate: date,
      },
    ],
    todolistId2: [
      {
        description: "",
        title: "bread",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "1",
        todoListId: "todolistId2",
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
        todoListId: "todolistId2",
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
        todoListId: "todolistId2",
        order: 0,
        addedDate: date,
      },
    ],
  };
});

test("correct task should be deleted from correct array", () => {
  const action = removeTaskAC("2", "todolistId2");

  const endState = tasksReducer(startState, action);
  expect(endState).toEqual({
    todolistId1: [
      {
        description: "",
        title: "CSS",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "1",
        todoListId: "todolistId1",
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
        todoListId: "todolistId1",
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
        todoListId: "todolistId1",
        order: 0,
        addedDate: date,
      },
    ],
    todolistId2: [
      {
        description: "",
        title: "bread",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: date,
        deadline: date,
        id: "1",
        todoListId: "todolistId2",
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
        todoListId: "todolistId2",
        order: 0,
        addedDate: date,
      },
    ],
  });
});

test("correct task should be added to correct array", () => {
  const action = addTaskAC("todolistId2", "juce");

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].completed).toBe(false);
});

test("status of specified task should be changed", () => {
  const action = changeTaskStatusAC("2", "todolistId2", true);

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][0].completed).toBe(false);
  expect(endState["todolistId2"][1].completed).toBe(true);
});

test("title of specified task should be changed", () => {
  const action = changeTaskTitleAC("2", "todolistId2", "test");

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"][0].title).toBe("CSS");
  expect(endState["todolistId2"][1].title).toBe("test");
});

test("property with todolistId should be deleted", () => {
  const action = removeTodoListAC("todolistId2");

  const endState = tasksReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});
