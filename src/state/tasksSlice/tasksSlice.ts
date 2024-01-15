import { Dispatch } from "redux";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ITask, IUpdateModelTask, taskAPI } from "api/api";
import { handleServerNetworkError } from "utils/handle-server-network-error";
import { todoListsActions } from "state/todoListsSlice/todoListsSlice";
import { clearData } from "common/actions/commonActions";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { appActions } from "state/appSlice/appSlice";
import { handleServerAppError } from "utils/handle-server-app-error";

export interface ITasksStateType {
  [key: string]: ITask[];
}
interface UpdateTaskArg {
  taskId: string;
  taskModel: Partial<IUpdateModelTask>;
  todoListId: string;
}

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
    // updateTaskAC: (
    //   state,
    //   action: PayloadAction<{
    //     todoListId: string;
    //     taskId: string;
    //     taskData: Partial<IUpdateModelTask>;
    //   }>
    // ) => {
    //   const index = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.taskId);
    //   if (index > -1) {
    //     state[action.payload.todoListId][index] = {
    //       ...state[action.payload.todoListId][index],
    //       ...action.payload.taskData,
    //     };
    //   }
    // },
    // setTasksAC: (state, action: PayloadAction<{ tasks: ITask[]; todoListId: string }>) => {
    //   state[action.payload.todoListId] = action.payload.tasks;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(todoListsActions.addTodoListAC, (state, action) => {
      state[action.payload.id] = [];
    });
    builder.addCase(todoListsActions.removeTodoListAC, (state, action) => {
      delete state[action.payload];
    });
    builder.addCase(todoListsActions.setTodoListsAC, (state, action) => {
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
        state[action.payload.todoListId].unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state[action.payload.todoListId].findIndex((t) => t.id === action.payload.taskId);

        if (index > -1) {
          state[action.payload.todoListId][index] = {
            ...state[action.payload.todoListId][index],
            ...action.payload.taskModel,
          };
        }
      });
  },
});

// Async Thunks
const fetchTasks = createAppAsyncThunk<{ tasks: ITask[]; todoListId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todoListId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus("loading"));
    try {
      const res = await taskAPI.getTasks(todoListId);
      const tasks = res.data.items;
      return { tasks, todoListId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatus("succeeded"));
    }
  }
);

const addTask = createAppAsyncThunk<ITask, { todoListId: string; title: string }>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatus("loading"));
    try {
      const res = await taskAPI.createTask(arg);
      const task = res.data.data.item;
      if (res.data.resultCode === 0) {
        return task;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatus("succeeded"));
    }
  }
);

const updateTask = createAppAsyncThunk<UpdateTaskArg, UpdateTaskArg>(
  `${slice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const task = state.tasksSlice[arg.todoListId].find((t) => t.id === arg.taskId);

    if (!task) return rejectWithValue(null);

    try {
      const apiModel: IUpdateModelTask = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.taskModel,
      };

      const res = await taskAPI.updateTask(arg.todoListId, arg.taskId, apiModel);

      if (res.data.resultCode === 0) {
        return arg;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

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

// export const updateTaskTC =
//   (todoListId: string, taskId: string, taskData: Partial<IUpdateModelTask>) =>
//   async (dispatch: Dispatch, getState: () => RootState) => {
//     dispatch(appActions.setAppStatus("loading"));
//     const state = getState();
//     const task = state.tasksSlice[todoListId].find((t) => t.id === taskId);

//     if (task) {
//       const taskModel: IUpdateModelTask = {
//         title: task.title,
//         description: task.description,
//         status: task.status,
//         priority: task.priority,
//         startDate: task.startDate,
//         deadline: task.deadline,
//         ...taskData,
//       };

//       try {
//         const res = await taskAPI.updateTask(todoListId, taskId, taskModel);
//         if (res.data.resultCode === 0) {
//           dispatch(taskActions.updateTaskAC({ todoListId, taskId, taskData }));
//         } else {
//           handleServerAppError(res.data, dispatch);
//         }
//       } catch (error: any) {
//         handleServerNetworkError(error, dispatch);
//       } finally {
//         dispatch(appActions.setAppStatus("succeeded"));
//       }
//     }
//   };

export const tasksReducer = slice.reducer;
export const taskActions = slice.actions;
export const tasksThunks = { fetchTasks, addTask, updateTask };
