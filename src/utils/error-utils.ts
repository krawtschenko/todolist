import { Dispatch } from "redux";
import { IResponse } from "../api/api";
import { AppActionsType, setAppErrorAC, setAppStatusAC } from "../state/appReducer/app-reducer";

// generic function
export const handleServerAppError = <T>(data: IResponse<T>, dispatch: ErrorUtilsDispatchType) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]));
  } else {
    dispatch(setAppErrorAC("Some error occurred"));
  }
  dispatch(setAppStatusAC("failed"));
};

export const handleServerNetworkError = (
  error: { message: string },
  dispatch: ErrorUtilsDispatchType
) => {
  dispatch(setAppErrorAC(error.message));
  dispatch(setAppStatusAC("failed"));
};

type ErrorUtilsDispatchType = Dispatch<AppActionsType>;
