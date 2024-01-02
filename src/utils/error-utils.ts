import { Dispatch } from "redux";
import { IResponse } from "../api/api";
import { setAppErrorAC, setAppStatusAC } from "../state/appReducer/app-reducer";

export const handleServerAppError = <T>(data: IResponse<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]));
  } else {
    dispatch(setAppErrorAC("Some error occurred"));
  }
  dispatch(setAppStatusAC("failed"));
};

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setAppErrorAC(error.message));
  dispatch(setAppStatusAC("failed"));
};
