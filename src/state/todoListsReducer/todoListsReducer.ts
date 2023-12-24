import { Dispatch } from "redux";
import { ITodoList, todoListAPI } from "../../api/api";
import { RequestStatusType, setAppErrorAC, setAppStatusAC } from "../appReducer/app-reducer";

export type FilterType = "all" | "active" | "completed";
export interface ITodoListDomain extends ITodoList {
  filter: FilterType;
  entityStatus: RequestStatusType;
}

const initialState: ITodoListDomain[] = [];

export const todoListsReducer = (state = initialState, action: ActionTypes): ITodoListDomain[] => {
  switch (action.type) {
    case "REMOVE-TODO-LIST":
      return state.filter((item) => item.id !== action.payload.id);
    case "ADD-TODO-LIST":
      return [{ ...action.payload.todoList, filter: "all", entityStatus: "succeeded" }, ...state];
    case "CHANGE-TODO-LIST-TITLE":
      return state.map((item) =>
        item.id === action.payload.id ? { ...item, title: action.payload.title } : item
      );
    case "CHANGE-TODO-LIST-FILTER":
      return state.map((item) =>
        item.id === action.payload.id ? { ...item, filter: action.payload.filter } : item
      );
    case "SET-TODO-LISTS":
      return action.payload.todoLists.map((item) => ({
        ...item,
        filter: "all",
        entityStatus: "succeeded",
      }));
    case "CHANGE-TODO-LIST-ENTITY-STATUS":
      return state.map((e) =>
        e.id === action.payload.todoListId ? { ...e, entityStatus: action.payload.status } : e
      );
    default:
      return state;
  }
};

type ActionTypes =
  | RemoveTodoListType
  | AddTodoListType
  | ReturnType<typeof changeTodoListTitleAC>
  | ReturnType<typeof changeTodoListFilterAC>
  | ReturnType<typeof changeTodoListEntityStatusAC>
  | setTodoListsType;

export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>;
export type AddTodoListType = ReturnType<typeof addTodoListAC>;
export type setTodoListsType = ReturnType<typeof SetTodoListsAC>;

export const removeTodoListAC = (id: string) => {
  return {
    type: "REMOVE-TODO-LIST" as const,
    payload: {
      id,
    },
  };
};
export const addTodoListAC = (todoList: ITodoList) => {
  return { type: "ADD-TODO-LIST", payload: { todoList } } as const;
};

export const changeTodoListTitleAC = (id: string, title: string) => {
  return {
    type: "CHANGE-TODO-LIST-TITLE" as const,
    payload: {
      id,
      title,
    },
  };
};

export const changeTodoListFilterAC = (id: string, filter: FilterType) => {
  return {
    type: "CHANGE-TODO-LIST-FILTER" as const,
    payload: {
      id,
      filter,
    },
  };
};

export const SetTodoListsAC = (todoLists: ITodoList[]) => {
  return {
    type: "SET-TODO-LISTS" as const,
    payload: {
      todoLists,
    },
  };
};

const changeTodoListEntityStatusAC = (todoListId: string, status: RequestStatusType) => {
  return {
    type: "CHANGE-TODO-LIST-ENTITY-STATUS" as const,
    payload: {
      todoListId,
      status,
    },
  };
};

// Thunk---------------------------------------------------------------------------------------------------
export const fetchTodoListsTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await todoListAPI.getTodoLists();
    dispatch(SetTodoListsAC(res.data));
  } catch (error: any) {
    dispatch(setAppErrorAC(error.message));
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const removeTodoListTC = (todoListId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  dispatch(changeTodoListEntityStatusAC(todoListId, "loading"));
  try {
    const res = await todoListAPI.deleteTodoList(todoListId);
    dispatch(removeTodoListAC(todoListId));
  } catch (error: any) {
    dispatch(setAppErrorAC(error.message));
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
    dispatch(setAppErrorAC(error.message));
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const changeTodoListTitleTC =
  (todoListId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC("loading"));
    try {
      const res = await todoListAPI.updateTodoList(todoListId, title);
      dispatch(changeTodoListTitleAC(todoListId, title));
    } catch (error: any) {
      dispatch(setAppErrorAC(error.message));
    } finally {
      dispatch(setAppStatusAC("succeeded"));
    }
  };
