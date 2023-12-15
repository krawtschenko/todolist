import { v1 } from "uuid";
import { Dispatch } from "redux";
import {
  AddTodoListType,
  RemoveTodoListType,
  setTodoListsType,
} from "../todoListsReducer/todoListsReducer";
import {
  ITask,
  IUpdateModelTask,
  TaskPriorities,
  TaskStatuses,
  taskAPI,
} from "../../api/api";
import { AppRootStateType } from "../store";

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
    case "SET-TODOLISTS":
      const stateCopy = { ...state };
      action.payload.todoLists.forEach((tl) => {
        stateCopy[tl.id] = [];
      });
      return stateCopy;
    case "SET-TASKS": {
      return { ...state, [action.payload.todoListId]: action.payload.tasks };
    }
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
  | RemoveTodoListType
  | setTodoListsType
  | setTasksType;
type RemoveTaskType = ReturnType<typeof removeTaskAC>;
type AddTaskType = ReturnType<typeof addTaskAC>;
type ChangeTaskStatusType = ReturnType<typeof changeTaskStatusAC>;
type ChangeTaskTitleType = ReturnType<typeof changeTaskTitleAC>;
type setTasksType = ReturnType<typeof setTasksAC>;

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

export const setTasksAC = (tasks: ITask[], todoListId: string) => {
  return {
    type: "SET-TASKS" as const,
    payload: {
      tasks,
      todoListId,
    },
  };
};

// ---------------------------------------------------------------------------------------------------
export const fetchTasksTC =
  (todoListId: string) => async (dispatch: Dispatch) => {
    const res = await taskAPI.getTasks(todoListId);
    dispatch(setTasksAC(res.data.items, todoListId));
  };

export const deleteTaskTC =
  (todoListId: string, taskId: string) => async (dispatch: Dispatch) => {
    const res = await taskAPI.deleteTask(todoListId, taskId);
    dispatch(removeTaskAC(taskId, todoListId));
  };

export const addTaskTC =
  (todoListId: string, title: string) => async (dispatch: Dispatch) => {
    const res = await taskAPI.createTask(todoListId, title);
    dispatch(addTaskAC(todoListId, title));
  };

export const updateTaskTC =
  (todoListId: string, taskId: string, taskData: string | boolean) =>
  async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todoListId].find((t) => t.id === taskId);

    if (task) {
      const taskModel: IUpdateModelTask = {
        title: typeof taskData === "string" ? taskData : task.title,
        description: task.description,
        completed: typeof taskData === "boolean" ? taskData : task.completed,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
      };

      const res = await taskAPI.updateTask(todoListId, taskId, taskModel);
    }
  };
