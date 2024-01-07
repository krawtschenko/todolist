import { Dispatch } from "redux";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { handleServerNetworkError } from "utils/error-utils";
import { ITodoList, todoListAPI } from "api/api";
import { RequestStatusType, setAppErrorAC, setAppStatusAC } from "state/appReducer/app-reducer";

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
    clearDataAC: () => {
      return [];
    },
  },
});

export const todoListReducers = slice.actions;
export default slice.reducer;

// Thunk---------------------------------------------------------------------------------------------------
export const fetchTodoListsTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await todoListAPI.getTodoLists();
    dispatch(todoListReducers.setTodoListsAC(res.data));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const removeTodoListTC = (todoListId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  dispatch(todoListReducers.changeTodoListEntityStatusAC({ todoListId, status: "loading" }));
  try {
    todoListAPI.deleteTodoList(todoListId);
    dispatch(todoListReducers.removeTodoListAC(todoListId));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const addTodoListTC = (title: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await todoListAPI.createTodoList(title);
    if (res.data.resultCode === 0) {
      dispatch(todoListReducers.addTodoListAC(res.data.data.item));
    } else {
      if (res.data.messages.length) {
        dispatch(setAppErrorAC(res.data.messages[0]));
      } else {
        dispatch(setAppErrorAC("Some error occurred"));
      }
    }
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const changeTodoListTitleTC = (todoListId: string, title: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    todoListAPI.updateTodoList(todoListId, title);
    dispatch(todoListReducers.changeTodoListTitleAC({ todoListId, title }));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};
