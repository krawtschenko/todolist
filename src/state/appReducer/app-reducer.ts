import { Dispatch } from "redux";
import { authAPI } from "../../api/api";
import { setIsLoggedInAC } from "../authReducer/authReducer";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
    setAppStatusAC: (state, action: PayloadAction<RequestStatusType>) => {
      state.status = action.payload;
    },
    setAppErrorAC: (state, action: PayloadAction<null | string>) => {
      state.error = action.payload;
    },
    setIsInitializedAC: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setAppStatusAC, setAppErrorAC, setIsInitializedAC } = slice.actions;
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
    dispatch(setIsInitializedAC(true));
  }
};
