import { Dispatch, PayloadAction, asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { handleServerNetworkError } from "utils/handle-server-network-error";
import { ITodoList, ResultCode, todoListAPI } from "api/api";
import { RequestStatusType, appActions } from "state/appSlice/appSlice";
import { clearData } from "common/actions/commonActions";

export type FilterType = "all" | "active" | "completed";
export interface ITodoListDomain extends ITodoList {
  filter: FilterType;
  entityStatus: RequestStatusType;
}

const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});

const slice = createAppSlice({
  name: "todoList",
  initialState: [] as ITodoListDomain[],
  reducers: (creators) => {
    const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null }>();
    return {
      // Actions
      removeTodoListAC: creators.reducer((state, action: PayloadAction<string>) => {
        // 1 var
        const index = state.findIndex((e) => e.id === action.payload);
        if (index > -1) {
          state.splice(index, 1);
        }
        // 2 var
        // return state.filter((item) => item.id !== action.payload);
      }),
      addTodoListAC: creators.reducer((state, action: PayloadAction<ITodoList>) => {
        state.unshift({ ...action.payload, filter: "all", entityStatus: "succeeded" });
      }),
      changeTodoListTitleAC: creators.reducer((state, action: PayloadAction<{ todoListId: string; title: string }>) => {
        // 1 var
        const todoList = state.find((e) => e.id === action.payload.todoListId);
        if (todoList) {
          todoList.title = action.payload.title;
        }
        // 2 var
        // return state.map((t) => (t.id === action.payload.todoListId ? { ...t, title: action.payload.title } : t));
      }),
      changeTodoListFilterAC: creators.reducer(
        (state, action: PayloadAction<{ todoListId: string; filter: FilterType }>) => {
          // 1 var
          const todoList = state.find((e) => e.id === action.payload.todoListId);
          if (todoList) {
            todoList.filter = action.payload.filter;
          }
          // 2 var
          // const index = state.findIndex((e) => e.id === action.payload.todoListId);
          // if (index > -1) {
          //   state[index].filter = action.payload.filter;
          // }

          // 3 var
          // return state.map((t) => (t.id === action.payload.todoListId ? { ...t, filter: action.payload.filter } : t));
        }
      ),
      changeTodoListEntityStatusAC: creators.reducer(
        (state, action: PayloadAction<{ todoListId: string; status: RequestStatusType }>) => {
          // 1 var
          const todoList = state.find((e) => e.id === action.payload.todoListId);
          if (todoList) {
            todoList.entityStatus = action.payload.status;
          }
          // 2 var
          // return state.map((t) => (t.id === action.payload.todoListId ? { ...t, entityStatus: action.payload.status } : t));
        }
      ),
      // setTodoListsAC: creators.reducer((state, action: PayloadAction<ITodoList[]>) => {
      //   // 1 var
      //   action.payload.forEach((t) => {
      //     state.push({ ...t, filter: "all", entityStatus: "idle" });
      //   });
      //   // 2 var
      //   // return action.payload.map((item) => ({ ...item, filter: "all", entityStatus: "succeeded" }));
      // }),
      // Thunks
      fetchTodoListsTC: createAThunk<undefined, ITodoList[]>(
        async (_, thunkAPI) => {
          const { dispatch, rejectWithValue } = thunkAPI;
          dispatch(appActions.setAppStatus("loading"));
          try {
            const res = await todoListAPI.getTodoLists();
            // dispatch(todoListsActions.setTodoListsAC(res.data));
            return res.data;
          } catch (error) {
            handleServerNetworkError(error, dispatch);
            return rejectWithValue(null);
          } finally {
            dispatch(appActions.setAppStatus("succeeded"));
          }
        },
        {
          fulfilled: (state, action) => {
            action.payload.forEach((t) => {
              state.push({ ...t, filter: "all", entityStatus: "idle" });
            });
          },
        }
      ),
    };
  },
  // reducers: {
  //   removeTodoListAC: (state, action: PayloadAction<string>) => {
  //     const index = state.findIndex((e) => e.id === action.payload);
  //     if (index > -1) {
  //       state.splice(index, 1);
  //     }
  //     // return state.filter((item) => item.id !== action.payload);
  //   },
  //   addTodoListAC: (state, action: PayloadAction<ITodoList>) => {
  //     state.unshift({ ...action.payload, filter: "all", entityStatus: "succeeded" });
  //   },
  //   changeTodoListTitleAC: (state, action: PayloadAction<{ todoListId: string; title: string }>) => {
  //     const todoList = state.find((e) => e.id === action.payload.todoListId);
  //     if (todoList) {
  //       todoList.title = action.payload.title;
  //     }
  //     // return state.map((t) => (t.id === action.payload.todoListId ? { ...t, title: action.payload.title } : t));
  //   },
  //   changeTodoListFilterAC: (state, action: PayloadAction<{ todoListId: string; filter: FilterType }>) => {
  //     const todoList = state.find((e) => e.id === action.payload.todoListId);
  //     if (todoList) {
  //       todoList.filter = action.payload.filter;
  //     }
  //     // const index = state.findIndex((e) => e.id === action.payload.todoListId);
  //     // if (index > -1) {
  //     //   state[index].filter = action.payload.filter;
  //     // }
  //     // return state.map((t) => (t.id === action.payload.todoListId ? { ...t, filter: action.payload.filter } : t));
  //   },
  //   changeTodoListEntityStatusAC: (state, action: PayloadAction<{ todoListId: string; status: RequestStatusType }>) => {
  //     const todoList = state.find((e) => e.id === action.payload.todoListId);
  //     if (todoList) {
  //       todoList.entityStatus = action.payload.status;
  //     }
  //     // return state.map((t) => (t.id === action.payload.todoListId ? { ...t, entityStatus: action.payload.status } : t));
  //   },
  //   setTodoListsAC: (state, action: PayloadAction<ITodoList[]>) => {
  //     action.payload.forEach((t) => {
  //       state.push({ ...t, filter: "all", entityStatus: "idle" });
  //     });
  //     // return action.payload.map((item) => ({ ...item, filter: "all", entityStatus: "succeeded" }));
  //   },
  // },
  extraReducers: (builder) => {
    builder.addCase(clearData.type, () => {
      return [];
    });
  },
});

// Old Thunks
// export const fetchTodoListsTC = () => async (dispatch: Dispatch) => {
//   dispatch(appActions.setAppStatus("loading"));
//   try {
//     const res = await todoListAPI.getTodoLists();
//     dispatch(todoListsActions.setTodoListsAC(res.data));
//   } catch (error: any) {
//     handleServerNetworkError(error, dispatch);
//   } finally {
//     dispatch(appActions.setAppStatus("succeeded"));
//   }
// };

export const removeTodoListTC = (todoListId: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus("loading"));
  dispatch(todoListsActions.changeTodoListEntityStatusAC({ todoListId, status: "loading" }));
  try {
    todoListAPI.deleteTodoList(todoListId);
    dispatch(todoListsActions.removeTodoListAC(todoListId));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(appActions.setAppStatus("succeeded"));
  }
};

export const addTodoListTC = (title: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus("loading"));
  try {
    const res = await todoListAPI.createTodoList(title);
    if (res.data.resultCode === ResultCode.success) {
      dispatch(todoListsActions.addTodoListAC(res.data.data.item));
    } else {
      if (res.data.messages.length) {
        dispatch(appActions.setAppError(res.data.messages[0]));
      } else {
        dispatch(appActions.setAppError("Some error occurred"));
      }
    }
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(appActions.setAppStatus("succeeded"));
  }
};

export const changeTodoListTitleTC = (todoListId: string, title: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus("loading"));
  try {
    todoListAPI.updateTodoList(todoListId, title);
    dispatch(todoListsActions.changeTodoListTitleAC({ todoListId, title }));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(appActions.setAppStatus("succeeded"));
  }
};

export const todoListsSlice = slice.reducer;
export const todoListsActions = slice.actions;
