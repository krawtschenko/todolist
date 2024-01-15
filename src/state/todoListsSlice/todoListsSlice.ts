import { Dispatch } from "redux";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { handleServerNetworkError } from "utils/handle-server-network-error";
import { ITodoList, todoListAPI } from "api/api";
import { RequestStatusType, appActions } from "state/appSlice/appSlice";
import { clearData } from "common/actions/commonActions";

export type FilterType = "all" | "active" | "completed";
export interface ITodoListDomain extends ITodoList {
  filter: FilterType;
  entityStatus: RequestStatusType;
}

const slice = createSlice({
  name: "todoList",
  initialState: [] as ITodoListDomain[],
  reducers: {
    removeTodoListAC: (state, action: PayloadAction<string>) => {
      const index = state.findIndex((e) => e.id === action.payload);
      if (index > -1) {
        state.splice(index, 1);
      }
      // return state.filter((item) => item.id !== action.payload);
    },
    addTodoListAC: (state, action: PayloadAction<ITodoList>) => {
      state.unshift({ ...action.payload, filter: "all", entityStatus: "succeeded" });
    },
    changeTodoListTitleAC: (state, action: PayloadAction<{ todoListId: string; title: string }>) => {
      const todoList = state.find((e) => e.id === action.payload.todoListId);
      if (todoList) {
        todoList.title = action.payload.title;
      }
      // return state.map((t) => (t.id === action.payload.todoListId ? { ...t, title: action.payload.title } : t));
    },
    changeTodoListFilterAC: (state, action: PayloadAction<{ todoListId: string; filter: FilterType }>) => {
      const todoList = state.find((e) => e.id === action.payload.todoListId);
      if (todoList) {
        todoList.filter = action.payload.filter;
      }
      // const index = state.findIndex((e) => e.id === action.payload.todoListId);
      // if (index > -1) {
      //   state[index].filter = action.payload.filter;
      // }
      // return state.map((t) => (t.id === action.payload.todoListId ? { ...t, filter: action.payload.filter } : t));
    },
    changeTodoListEntityStatusAC: (state, action: PayloadAction<{ todoListId: string; status: RequestStatusType }>) => {
      const todoList = state.find((e) => e.id === action.payload.todoListId);
      if (todoList) {
        todoList.entityStatus = action.payload.status;
      }
      // return state.map((t) => (t.id === action.payload.todoListId ? { ...t, entityStatus: action.payload.status } : t));
    },
    setTodoListsAC: (state, action: PayloadAction<ITodoList[]>) => {
      action.payload.forEach((t) => {
        state.push({ ...t, filter: "all", entityStatus: "idle" });
      });
      // return action.payload.map((item) => ({ ...item, filter: "all", entityStatus: "succeeded" }));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearData.type, () => {
      return [];
    });
  },
});

export const todoListsReducer = slice.reducer;
export const todoListsActions = slice.actions;

// Thunk---------------------------------------------------------------------------------------------------
export const fetchTodoListsTC = () => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus("loading"));
  try {
    const res = await todoListAPI.getTodoLists();
    dispatch(todoListsActions.setTodoListsAC(res.data));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(appActions.setAppStatus("succeeded"));
  }
};

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
    if (res.data.resultCode === 0) {
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
