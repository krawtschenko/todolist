import { Dispatch } from "redux";
import { AppRootStateType } from "../store";
import { setAppStatusAC } from "../appReducer/app-reducer";
import { ITask, IUpdateModelTask, taskAPI } from "../../api/api";
import { addTodoListAC, clearDataAC, removeTodoListAC, setTodoListsAC } from "../todoListsReducer/todoListsReducer";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface ITasksStateType {
  [key: string]: ITask[];
}
const initialState: ITasksStateType = {};

const slice = createSlice({
  name: "task",
  initialState,
  reducers: {
    removeTaskAC: (state, action: PayloadAction<{ taskId: string; todoListId: string }>) => {
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].filter(
          (elem) => elem.id !== action.payload.taskId
        ),
      };
    },
    addTaskAC: (state, action: PayloadAction<ITask>) => {
      state[action.payload.todoListId].unshift(action.payload);
    },
    updateTaskAC: (
      state,
      action: PayloadAction<{
        todoListId: string;
        taskId: string;
        taskData: Partial<IUpdateModelTask>;
      }>
    ) => {
      return {
        ...state,
        [action.payload.todoListId]: state[action.payload.todoListId].map((t) =>
          t.id === action.payload.taskId ? { ...t, ...action.payload.taskData } : t
        ),
      };
    },
    setTasksAC: (state, action: PayloadAction<{ tasks: ITask[]; todoListId: string }>) => {
      state[action.payload.todoListId] = action.payload.tasks;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodoListAC, (state, action) => {
      state[action.payload.id] = [];
    });
    builder.addCase(removeTodoListAC, (state, action) => {
      delete state[action.payload];
    });
    builder.addCase(setTodoListsAC, (state, action) => {
      action.payload.forEach((tl) => {
        state[tl.id] = [];
      });
    });
    builder.addCase(clearDataAC, () => {
      return {};
    });
  },
});

export const { removeTaskAC, addTaskAC, updateTaskAC, setTasksAC } = slice.actions;
export default slice.reducer;

// Thunks
export const fetchTasksTC = (todoListId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await taskAPI.getTasks(todoListId);
    dispatch(setTasksAC({ tasks: res.data.items, todoListId }));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const deleteTaskTC = (todoListId: string, taskId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await taskAPI.deleteTask(todoListId, taskId);
    dispatch(removeTaskAC({ taskId, todoListId }));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
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
          dispatch(updateTaskAC({ todoListId, taskId, taskData }));
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
