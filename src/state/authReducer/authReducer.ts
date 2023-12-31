import { Dispatch } from "redux";
import { AppActionsType, setAppStatusAC } from "../appReducer/app-reducer";
import { ILoginParams, authAPI } from "../../api/api";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";

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
export const loginTC = (data: ILoginParams) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  try {
    const res = await authAPI.login(data);
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setAppStatusAC("succeeded"));
  }
};

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};

// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | AppActionsType;
