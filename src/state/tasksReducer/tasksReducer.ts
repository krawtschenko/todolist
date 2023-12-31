import { Dispatch } from "redux";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITask, IUpdateModelTask, taskAPI } from "api/api";
import { RootState } from "state/store";
import { setAppStatusAC } from "state/appReducer/app-reducer";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { todoListReducers } from "state/todoListsReducer/todoListsReducer";

export interface ITasksStateType {
  [key: string]: ITask[];
}

const slice = createSlice({
  name: "task",
  initialState: {} as ITasksStateType,
  reducers: {
    removeTaskAC: (state, action: PayloadAction<{ taskId: string; todoListId: string }>) => {
      const index = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        state[action.payload.todoListId].splice(index, 1);
      }
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
      const index = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        state[action.payload.todoListId][index] = {
          ...state[action.payload.todoListId][index],
          ...action.payload.taskData,
        };
      }
    },
    setTasksAC: (state, action: PayloadAction<{ tasks: ITask[]; todoListId: string }>) => {
      state[action.payload.todoListId] = action.payload.tasks;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(todoListReducers.addTodoListAC, (state, action) => {
      state[action.payload.id] = [];
    });
    builder.addCase(todoListReducers.removeTodoListAC, (state, action) => {
      delete state[action.payload];
    });
    builder.addCase(todoListReducers.setTodoListsAC, (state, action) => {
      action.payload.forEach((tl) => {
        state[tl.id] = [];
      });
    });
    builder.addCase(todoListReducers.clearDataAC, () => {
      return {};
    });
  },
});

export const taskReducers = slice.actions;
export default slice.reducer;

// Thunks
export const fetchTasksTC = (todoListId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await taskAPI.getTasks(todoListId);
    dispatch(taskReducers.setTasksAC({ tasks: res.data.items, todoListId }));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const deleteTaskTC = (todoListId: string, taskId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    taskAPI.deleteTask(todoListId, taskId);
    dispatch(taskReducers.removeTaskAC({ taskId, todoListId }));
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
      dispatch(taskReducers.addTaskAC(res.data.data.item));
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
  async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setAppStatusAC("loading"));
    const state = getState();
    const task = state.tasksSlice[todoListId].find((t) => t.id === taskId);

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
          dispatch(taskReducers.updateTaskAC({ todoListId, taskId, taskData }));
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
