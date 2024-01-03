import { Dispatch } from "redux";
import { ITodoList, todoListAPI } from "../../api/api";
import { RequestStatusType, setAppErrorAC, setAppStatusAC } from "../appReducer/app-reducer";
import { handleServerNetworkError } from "../../utils/error-utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type FilterType = "all" | "active" | "completed";
export interface ITodoListDomain extends ITodoList {
  filter: FilterType;
  entityStatus: RequestStatusType;
}

const initialState: ITodoListDomain[] = [];

const slice = createSlice({
  name: "todoList",
  initialState,
  reducers: {
    removeTodoListAC: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload);
    },
    addTodoListAC: (state, action: PayloadAction<ITodoList>) => {
      state.unshift({ ...action.payload, filter: "all", entityStatus: "succeeded" });
    },
    changeTodoListTitleAC: (
      state,
      action: PayloadAction<{ todoListId: string; title: string }>
    ) => {
      // state[+action.payload.todoListId].title = action.payload.title;
      return state.map((t) =>
        t.id === action.payload.todoListId ? { ...t, title: action.payload.title } : t
      );
    },
    changeTodoListFilterAC: (
      state,
      action: PayloadAction<{ todoListId: string; filter: FilterType }>
    ) => {
      // state[+action.payload.todoListId].filter = action.payload.filter;
      return state.map((t) =>
        t.id === action.payload.todoListId ? { ...t, filter: action.payload.filter } : t
      );
    },
    changeTodoListEntityStatusAC: (
      state,
      action: PayloadAction<{ todoListId: string; status: RequestStatusType }>
    ) => {
      // state[+action.payload.todoListId].entityStatus = action.payload.status;
      return state.map((t) =>
        t.id === action.payload.todoListId ? { ...t, entityStatus: action.payload.status } : t
      );
    },
    SetTodoListsAC: (state, action: PayloadAction<ITodoList[]>) => {
      return action.payload.map((item) => ({ ...item, filter: "all", entityStatus: "succeeded" }));
    },
    clearDataAC: () => {
      return [];
    },
  },
});

export const {
  removeTodoListAC,
  addTodoListAC,
  changeTodoListTitleAC,
  changeTodoListFilterAC,
  changeTodoListEntityStatusAC,
  SetTodoListsAC,
  clearDataAC,
} = slice.actions;
export default slice.reducer;

export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>;
export type AddTodoListType = ReturnType<typeof addTodoListAC>;
export type setTodoListsType = ReturnType<typeof SetTodoListsAC>;
export type clearDataType = ReturnType<typeof clearDataAC>;

// Thunk---------------------------------------------------------------------------------------------------
export const fetchTodoListsTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await todoListAPI.getTodoLists();
    dispatch(SetTodoListsAC(res.data));
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const removeTodoListTC = (todoListId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  dispatch(changeTodoListEntityStatusAC({ todoListId, status: "loading" }));
  try {
    const res = await todoListAPI.deleteTodoList(todoListId);
    dispatch(removeTodoListAC(todoListId));
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
      dispatch(addTodoListAC(res.data.data.item));
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

export const changeTodoListTitleTC =
  (todoListId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"));
    try {
      const res = await todoListAPI.updateTodoList(todoListId, title);
      dispatch(changeTodoListTitleAC({ todoListId, title }));
    } catch (error: any) {
      handleServerNetworkError(error, dispatch);
    } finally {
      dispatch(setAppStatusAC("succeeded"));
    }
  };
