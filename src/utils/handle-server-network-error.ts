import axios from "axios";
import { appActions } from "state/appReducer/app-reducer";
import { AppDispatch } from "state/store";

export const handleServerNetworkError = (err: unknown, dispatch: AppDispatch): void => {
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
