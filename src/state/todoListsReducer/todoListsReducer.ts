import { Dispatch } from "redux";
import { ITodoList, todoListAPI } from "../../api/api";
import { setAppErrorAC, setAppStatusAC } from "../appReducer/app-reducer";

export type FilterType = "all" | "active" | "completed";
export interface ITodoListDomain extends ITodoList {
  filter: FilterType;
}

const initialState: ITodoListDomain[] = [];

export const todoListsReducer = (state = initialState, action: ActionTypes): ITodoListDomain[] => {
  switch (action.type) {
    case "REMOVE-TODO-LIST":
      return state.filter((item) => item.id !== action.payload.id);
    case "ADD-TODO-LIST":
      return [{ ...action.payload.todoList, filter: "all" }, ...state];
    case "CHANGE-TODO-LIST-TITLE":
      return state.map((item) =>
        item.id === action.payload.id ? { ...item, title: action.payload.title } : item
      );
    case "CHANGE-TODO-LIST-FILTER":
      return state.map((item) =>
        item.id === action.payload.id ? { ...item, filter: action.payload.filter } : item
      );
    case "SET-TODO-LISTS":
      return action.payload.todoLists.map((item) => ({ ...item, filter: "all" }));
    default:
      return state;
  }
};

type ActionTypes =
  | RemoveTodoListType
  | AddTodoListType
  | ReturnType<typeof changeTodoListTitleAC>
  | ReturnType<typeof changeTodoListFilterAC>
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

// ---------------------------------------------------------------------------------------------------
export const fetchTodoListsTC = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await todoListAPI.getTodoLists();
    dispatch(SetTodoListsAC(res.data));
  } catch (error) {
    throw new Error("error");
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const removeTodoListTC = (todoListId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await todoListAPI.deleteTodoList(todoListId);
    dispatch(removeTodoListAC(todoListId));
  } catch (error) {
    throw new Error("error");
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
  } catch (error) {
    throw new Error("error");
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const changeTodoListTitleTC = (todoListId: string, title: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await todoListAPI.updateTodoList(todoListId, title);
    dispatch(changeTodoListTitleAC(todoListId, title));
  } catch (error) {
    throw new Error("error");
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};
