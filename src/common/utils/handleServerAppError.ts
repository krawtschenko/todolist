import { Dispatch } from "@reduxjs/toolkit";
import { appActions } from "app/model/appSlice";
import {IResponse} from "common/interfaces";

export const handleServerAppError = <T>(data: IResponse<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError(data.messages[0]));
  } else {
    dispatch(appActions.setAppError("Some error occurred"));
  }
  dispatch(appActions.setAppStatus("failed"));
};
