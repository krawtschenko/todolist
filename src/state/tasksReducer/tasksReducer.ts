import { v1 } from "uuid";
import {
  AddTodoListType,
  RemoveTodoListType,
} from "../todoListsReducer/todoListsReducer";
import { ITask, TaskPriorities, TaskStatuses } from "../../api/todoList_API";

export interface ITasksStateType {
  [key: string]: ITask[];
}

const initialState: ITasksStateType = {};

export const tasksReducer = (
  state = initialState,
  action: ActionTypes
): ITasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].filter(
          (elem) => elem.id !== action.payload.taskId
        ),
      };
    case "ADD-TASK":
      const task = {
        description: "",
        title: action.payload.title,
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: new Date(),
        deadline: new Date(),
        id: v1(),
        todoListId: action.payload.todoListId,
        order: 0,
        addedDate: new Date(),
      };
      return {
        ...state,
        [action.payload.todoListId]: [
          task,
          ...state[action.payload.todoListId],
        ],
      };
    case "CHANGE-TASK-STATUS":
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].map(
          (elem) =>
            elem.id === action.payload.taskId
              ? { ...elem, completed: action.payload.completed }
              : elem
        ),
      };
    case "CHANGE-TASK-TITLE":
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].map(
          (elem) =>
            elem.id === action.payload.taskId
              ? { ...elem, title: action.payload.title }
              : elem
        ),
      };
    case "ADD-TODOLIST":
      return {
        ...state,
        [action.payload.todoListId]: [],
      };
    case "REMOVE-TODOLIST":
      const newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    default:
      return state;
  }
};

type ActionTypes =
  | RemoveTaskType
  | AddTaskType
  | ChangeTaskStatusType
  | ChangeTaskTitleType
  | AddTodoListType
  | RemoveTodoListType;
type RemoveTaskType = ReturnType<typeof removeTaskAC>;
type AddTaskType = ReturnType<typeof addTaskAC>;
type ChangeTaskStatusType = ReturnType<typeof changeTaskStatusAC>;
type ChangeTaskTitleType = ReturnType<typeof changeTaskTitleAC>;

export const removeTaskAC = (taskId: string, todoListId: string) => {
  return {
    type: "REMOVE-TASK" as const,
    payload: {
      taskId,
      todoListId,
    },
  };
};

export const addTaskAC = (todoListId: string, title: string) => {
  return {
    type: "ADD-TASK" as const,
    payload: {
      todoListId,
      title,
    },
  };
};

export const changeTaskStatusAC = (
  taskId: string,
  todoListId: string,
  completed: boolean
) => {
  return {
    type: "CHANGE-TASK-STATUS" as const,
    payload: {
      taskId,
      todoListId,
      completed,
    },
  };
};

export const changeTaskTitleAC = (
  taskId: string,
  todoListId: string,
  title: string
) => {
  return {
    type: "CHANGE-TASK-TITLE" as const,
    payload: {
      taskId,
      todoListId,
      title,
    },
  };
};
