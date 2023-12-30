import { Dispatch } from "redux";
import { AppActionsType, setAppStatusAC } from "../appReducer/app-reducer";
import { authAPI } from "../../api/api";

const initialState = {
  isLoggedIn: false,
};

type InitialStateType = typeof initialState;

export const authReducer = (state = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.value };
    default:
      return state;
  }
};
// actions
export const setIsLoggedInAC = (value: boolean) =>
  ({ type: "login/SET-IS-LOGGED-IN", value } as const);

// thunks
export const loginTC = (data: any) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
  } catch (error) {
    
  }
};

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | AppActionsType;
