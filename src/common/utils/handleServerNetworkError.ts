import axios from "axios";
import { Dispatch } from "@reduxjs/toolkit";
import { appActions } from "app/model/appSlice";

export const handleServerNetworkError = (err: unknown, dispatch: Dispatch): void => {
  let errorMessage = "Some error occurred";

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || err?.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`;
  } else {
    errorMessage = JSON.stringify(err);
  }

  dispatch(appActions.setAppError(errorMessage));
  dispatch(appActions.setAppStatus("failed"));
};

// export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
//   dispatch(setAppErrorAC(error.message));
//   dispatch(setAppStatusAC("failed"));
// };
