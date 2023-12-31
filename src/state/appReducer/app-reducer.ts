import { Dispatch } from "redux";
import { authAPI } from "../../api/api";
import { setIsLoggedInAC } from "../authReducer/authReducer";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as null | string,
  isInitialized: false,
};

type InitialStateType = typeof initialState;

export const appReducer = (state = initialState, action: AppActionsType): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    case "APP/SET-INITIALIZED":
      return { ...state, isInitialized: action.value };
    default:
      return state;
  }
};

export type AppActionsType =
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppErrorAC>
  | ReturnType<typeof setIsInitializedAC>;

export const setAppStatusAC = (status: RequestStatusType) => ({
  type: "APP/SET-STATUS" as const,
  status,
});
export const setAppErrorAC = (error: null | string) => ({ type: "APP/SET-ERROR" as const, error });
export const setIsInitializedAC = (value: boolean) => ({
  type: "APP/SET-INITIALIZED" as const,
  value,
});

export const initializeAppTC = () => async (dispatch: Dispatch) => {
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (error: any) {
    handleServerNetworkError(error, dispatch);
  } finally {
    dispatch(setIsInitializedAC(true));
  }
};
