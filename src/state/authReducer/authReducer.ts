import { Dispatch } from "redux";
import { setAppStatusAC } from "../appReducer/app-reducer";
import { ILoginParams, authAPI } from "../../api/api";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { todoListReducers } from "state/todoListsReducer/todoListsReducer";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setIsLoggedInAC } = slice.actions;
export default slice.reducer;

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

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(setAppStatusAC("succeeded"));
        dispatch(todoListReducers.clearDataAC());
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
