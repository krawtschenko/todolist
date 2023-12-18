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
        status: TaskStatuses.New,
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
    case "UPDATE-TASK":
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].map((t) =>
          t.id === action.payload.taskId
            ? { ...t, ...action.payload.taskData }
            : t
        ),
      };
    case "ADD-TODO-LIST":
      return {
        ...state,
        [action.payload.todoListId]: [],
      };
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
  | setTodoListsType;

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

interface IUpdateTask {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: Date;
  deadline?: Date;
}

export const updateTaskAC = (
  todoListId: string,
  taskId: string,
  taskData: IUpdateTask
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
  (todoListId: string, taskId: string, taskData: IUpdateTask) =>
  async (dispatch: Dispatch, getState: () => AppRootStateType) => {
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

      const res = await taskAPI.updateTask(todoListId, taskId, taskModel);
      dispatch(updateTaskAC(todoListId, taskId, taskData));
    }
  };
