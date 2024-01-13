import { Dispatch } from "redux";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITask, IUpdateModelTask, taskAPI } from "api/api";
import { RootState } from "state/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { todoListReducers } from "state/todoListsReducer/todoListsReducer";
import { clearData } from "common/actions/commonActions";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { appActions } from "state/appReducer/app-reducer";

export interface ITasksStateType {
  [key: string]: ITask[];
}

// Thunks
const fetchTasks = createAppAsyncThunk<{ tasks: ITask[]; todoListId: string }, string>(
  "tasks/fetchTasks",
  async (todoListId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus("loading"));
    try {
      const res = await taskAPI.getTasks(todoListId);
      const tasks = res.data.items;
      return { tasks, todoListId };
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatus("succeeded"));
    }
  }
);

const addTask = createAppAsyncThunk<
  { task: ITask; todoListId: string; title: string },
  { todoListId: string; title: string }
>("tasks/addTask", async (arg: { todoListId: string; title: string }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatus("loading"));
  try {
    const res = await taskAPI.createTask(arg);
    const task = res.data.data.item;
    if (res.data.resultCode === 0) {
      return { task, todoListId: arg.todoListId, title: arg.title };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatus("succeeded"));
  }
});

// Slice
const slice = createSlice({
  name: "tasks",
  initialState: {} as ITasksStateType,
  reducers: {
    removeTaskAC: (state, action: PayloadAction<{ taskId: string; todoListId: string }>) => {
      const index = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        state[action.payload.todoListId].splice(index, 1);
      }
    },
    // addTaskAC: (state, action: PayloadAction<ITask>) => {
    //   state[action.payload.todoListId].unshift(action.payload);
    // },
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
    // setTasksAC: (state, action: PayloadAction<{ tasks: ITask[]; todoListId: string }>) => {
    //   state[action.payload.todoListId] = action.payload.tasks;
    // },
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
    builder.addCase(clearData.type, () => {
      return {};
    });
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todoListId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift(action.payload.task);
      });
  },
});

// Old thunks
// export const fetchTasksTC = (todoListId: string) => async (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC("loading"));
//   try {
//     const res = await taskAPI.getTasks(todoListId);
//     dispatch(taskReducers.setTasksAC({ tasks: res.data.items, todoListId }));
//   } catch (error: any) {
//     handleServerNetworkError(error, dispatch);
//   } finally {
//     dispatch(setAppStatusAC("succeeded"));
//   }
// };

export const deleteTaskTC = (todoListId: string, taskId: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus("loading"));
  try {
    await taskAPI.deleteTask(todoListId, taskId);
    dispatch(taskActions.removeTaskAC({ taskId, todoListId }));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(appActions.setAppStatus("succeeded"));
  }
};

// export const addTaskTC = (todoListId: string, title: string) => async (dispatch: Dispatch) => {
//   dispatch(appActions.setAppStatus("loading"));
//   try {
//     const res = await taskAPI.createTask(todoListId, title);
//     if (res.data.resultCode === 0) {
//       dispatch(taskActions.addTaskAC(res.data.data.item));
//     } else {
//       handleServerAppError(res.data, dispatch);
//     }
//   } catch (error: any) {
//     handleServerNetworkError(error, dispatch);
//   } finally {
//     dispatch(appActions.setAppStatus("succeeded"));
//   }
// };

export const updateTaskTC =
  (todoListId: string, taskId: string, taskData: Partial<IUpdateModelTask>) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(appActions.setAppStatus("loading"));
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
          dispatch(taskActions.updateTaskAC({ todoListId, taskId, taskData }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      } catch (error: any) {
        handleServerNetworkError(error, dispatch);
      } finally {
        dispatch(appActions.setAppStatus("succeeded"));
      }
    }
  };

export const taskActions = slice.actions;
export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasks, addTask };
