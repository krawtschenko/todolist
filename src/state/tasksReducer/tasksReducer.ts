import { Dispatch } from "redux";
import { AppRootStateType } from "../store";
import { setAppStatusAC } from "../appReducer/app-reducer";
import { ITask, IUpdateModelTask, taskAPI } from "../../api/api";
import {
  AddTodoListType,
  RemoveTodoListType,
  setTodoListsType,
  clearDataType,
} from "../todoListsReducer/todoListsReducer";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";

export interface ITasksStateType {
  [key: string]: ITask[];
}

const initialState: ITasksStateType = {};

export const tasksReducer = (state = initialState, action: ActionTypes): ITasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].filter(
          (elem) => elem.id !== action.payload.taskId
        ),
      };
    case "ADD-TASK":
      return {
        ...state,
        [action.payload.task.todoListId]: [
          action.payload.task,
          ...state[action.payload.task.todoListId],
        ],
      };
    case "UPDATE-TASK":
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].map((t) =>
          t.id === action.payload.taskId ? { ...t, ...action.payload.taskData } : t
        ),
      };
    case "ADD-TODO-LIST":
      return { ...state, [action.payload.todoList.id]: [] };
    case "REMOVE-TODO-LIST":
      const newState = { ...state };
      delete newState[action.payload.id];
      return newState;
    case "SET-TODO-LISTS":
      const stateCopy = { ...state };
      action.payload.todoLists.forEach((tl) => {
        stateCopy[tl.id] = [];
      });
      return stateCopy;
    case "SET-TASKS": {
      return { ...state, [action.payload.todoListId]: action.payload.tasks };
    }
    case "CLEAR-DATA":
      return {};
    default:
      return state;
  }
};

type ActionTypes =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof setTasksAC>
  | AddTodoListType
  | RemoveTodoListType
  | setTodoListsType
  | clearDataType;

export const removeTaskAC = (taskId: string, todoListId: string) => {
  return {
    type: "REMOVE-TASK" as const,
    payload: {
      taskId,
      todoListId,
    },
  };
};

export const addTaskAC = (task: ITask) => {
  return {
    type: "ADD-TASK" as const,
    payload: {
      task,
    },
  };
};

export const updateTaskAC = (
  todoListId: string,
  taskId: string,
  taskData: Partial<IUpdateModelTask>
) => {
  return {
    type: "UPDATE-TASK" as const,
    payload: {
      todoListId,
      taskId,
      taskData,
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
export const fetchTasksTC = (todoListId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await taskAPI.getTasks(todoListId);
    dispatch(setTasksAC(res.data.items, todoListId));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const deleteTaskTC = (todoListId: string, taskId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await taskAPI.getTasks(todoListId);
    dispatch(setTasksAC(res.data.items, todoListId));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
  const res = await taskAPI.deleteTask(todoListId, taskId);
  dispatch(removeTaskAC(taskId, todoListId));
};

export const addTaskTC = (todoListId: string, title: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await taskAPI.createTask(todoListId, title);
    if (res.data.resultCode === 0) {
      dispatch(addTaskAC(res.data.data.item));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const updateTaskTC =
  (todoListId: string, taskId: string, taskData: Partial<IUpdateModelTask>) =>
  async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC("loading"));
    const state = getState();
    const task = state.tasks[todoListId].find((t) => t.id === taskId);

    if (task) {
      const taskModel: IUpdateModelTask = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...taskData,
      };

      try {
        const res = await taskAPI.updateTask(todoListId, taskId, taskModel);
        if (res.data.resultCode === 0) {
          dispatch(updateTaskAC(todoListId, taskId, taskData));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      } catch (error: any) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(setAppStatusAC("succeeded"));
      }
    }
  };
