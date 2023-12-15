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
    case "REMOVE-TODO-LIST":
      return state.filter((item) => item.id !== action.payload.id);
    case "ADD-TODO-LIST":
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
    case "CHANGE-TODO-LIST-TITLE":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, title: action.payload.title }
          : item
      );
    case "CHANGE-TODO-LIST-FILTER":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, filter: action.payload.filter }
          : item
      );
    case "SET-TODO-LISTS":
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
export type setTodoListsType = ReturnType<typeof SetTodoListsAC>;

export const removeTodoListAC = (id: string) => {
  return {
    type: "REMOVE-TODO-LIST" as const,
    payload: {
      id,
    },
  };
};

export const addTodoListAC = (title: string) => {
  return {
    type: "ADD-TODO-LIST" as const,
    payload: {
      title,
      todoListId: v1(),
    },
  };
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
  const res = await todoListAPI.getTodoLists();
  dispatch(SetTodoListsAC(res.data));
};
