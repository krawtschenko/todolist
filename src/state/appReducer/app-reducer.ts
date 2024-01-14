import { Dispatch } from "redux";
import { authAPI } from "../../api/api";
import { setIsLoggedInAC } from "../authReducer/authReducer";
import { handleServerNetworkError } from "../../utils/handle-server-network-error";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { handleServerAppError } from "utils/handle-server-app-error";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = ReturnType<typeof slice.getInitialState>;

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
  },
  reducers: {
    setAppStatus: (state, action: PayloadAction<RequestStatusType>) => {
      state.status = action.payload;
    },
    setAppError: (state, action: PayloadAction<null | string>) => {
      state.error = action.payload;
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const appActions = slice.actions;
export default slice.reducer;

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
    dispatch(appActions.setIsInitialized(true));
  }
};
