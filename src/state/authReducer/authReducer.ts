import { Dispatch } from "redux";
import { ILoginParams, authAPI } from "../../api/api";
import {handleServerNetworkError } from "../../utils/handle-server-network-error";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { clearData } from "common/actions/commonActions";
import { appActions } from "state/appReducer/app-reducer";
import { handleServerAppError } from "utils/handle-server-app-error";

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
  dispatch(appActions.setAppStatus("loading"));
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
    dispatch(appActions.setAppStatus("succeeded"));
  }
};

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatus("loading"));
  authAPI
    .logout()
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false));
        dispatch(appActions.setAppStatus("succeeded"));
        dispatch(clearData());
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
