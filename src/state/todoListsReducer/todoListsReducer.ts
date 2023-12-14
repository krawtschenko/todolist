import { v1 } from "uuid";
import { Dispatch } from "redux";
import { ITodoList, todoListAPI } from "../../api/api";

export type FilterType = "all" | "active" | "completed";
export interface ITodoListDomain extends ITodoList {
  filter: FilterType;
}

const initialState: ITodoListDomain[] = [];

export const todoListsReducer = (
  state = initialState,
  action: ActionTypes
): ITodoListDomain[] => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((item) => item.id !== action.payload.id);
    case "ADD-TODOLIST":
      return [
        {
          id: action.payload.todoListId,
          title: action.payload.title,
          addedDate: new Date(),
          order: 1,
          filter: "all",
        },
        ...state,
      ];
    case "CHANGE-TODOLIST-TITLE":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, title: action.payload.title }
          : item
      );
    case "CHANGE-TODOLIST-FILTER":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, filter: action.payload.filter }
          : item
      );
    case "SET-TODOLISTS":
      return action.payload.todoLists.map((item) => ({
        ...item,
        filter: "all",
      }));
    default:
      return state;
  }
};

type ActionTypes =
  | RemoveTodoListType
  | AddTodoListType
  | changeTodoListTitleType
  | changeTodoListFilterType
  | setTodoListsType;

export type RemoveTodoListType = ReturnType<typeof removeTodoListAC>;
export type AddTodoListType = ReturnType<typeof addTodoListAC>;
type changeTodoListTitleType = ReturnType<typeof changeTodoListTitleAC>;
type changeTodoListFilterType = ReturnType<typeof changeTodoListFilterAC>;
export type setTodoListsType = ReturnType<typeof setTodoListsAC>;

export const removeTodoListAC = (id: string) => {
  return {
    type: "REMOVE-TODOLIST" as const,
    payload: {
      id,
    },
  };
};

export const addTodoListAC = (title: string) => {
  return {
    type: "ADD-TODOLIST" as const,
    payload: {
      title,
      todoListId: v1(),
    },
  };
};

export const changeTodoListTitleAC = (id: string, title: string) => {
  return {
    type: "CHANGE-TODOLIST-TITLE" as const,
    payload: {
      id,
      title,
    },
  };
};

export const changeTodoListFilterAC = (id: string, filter: FilterType) => {
  return {
    type: "CHANGE-TODOLIST-FILTER" as const,
    payload: {
      id,
      filter,
    },
  };
};

export const setTodoListsAC = (todoLists: ITodoList[]) => {
  return {
    type: "SET-TODOLISTS" as const,
    payload: {
      todoLists,
    },
  };
};

// ---------------------------------------------------------------------------------------------------
export const fetchTodoListsTC = () => async (dispatch: Dispatch) => {
  const res = await todoListAPI.getTodoLists();
  dispatch(setTodoListsAC(res.data));
};
