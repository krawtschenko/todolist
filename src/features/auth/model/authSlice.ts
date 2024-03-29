import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {
	asyncThunkCreator,
	buildCreateSlice,
	isAnyOf,
	isFulfilled,
	PayloadAction,
	UnknownAction
} from "@reduxjs/toolkit";
import {clearData} from "common/actions/commonActions";
import {appActions} from "app/model/appSlice";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {ILoginParams} from "common/interfaces";
import {authAPI} from "features/auth/api/authAPI";
import {ResultCode} from "common/enums";

const createAppSlice = buildCreateSlice({
	creators: {asyncThunk: asyncThunkCreator},
});

const slice = createAppSlice({
	name: "auth",
	initialState: {
		isLoggedIn: false,
	},
	selectors: {
		selectIsLoggedIn: (sliceState) => sliceState.isLoggedIn
	},
	reducers: (creators) => {
		const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null }>();
		return {
			login: createAThunk<ILoginParams, boolean>(async (arg, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI
				dispatch(appActions.setAppStatus("loading"));
				try {
					const res = await authAPI.login(arg);
					if (res.data.resultCode === ResultCode.success) {
						return true
					} else {
						handleServerAppError(res.data, dispatch);
						return rejectWithValue(null)
					}
				} catch (error) {
					handleServerNetworkError(error, dispatch);
					return rejectWithValue(null)
				} finally {
					dispatch(appActions.setAppStatus("succeeded"));
				}
			}),
			logout: createAThunk<undefined, boolean>(async (_, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI
				dispatch(appActions.setAppStatus("loading"));
				try {
					const res = await authAPI.logout()
					if (res.data.resultCode === ResultCode.success) {
						dispatch(clearData());
						return false
					} else {
						handleServerAppError(res.data, dispatch);
						return rejectWithValue(null)
					}
				} catch (error) {
					handleServerNetworkError(error, dispatch);
					return rejectWithValue(null)
				} finally {
					dispatch(appActions.setAppStatus("succeeded"));
				}
			}),
			initializeApp: createAThunk<undefined, boolean>(async (_, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI
				try {
					const res = await authAPI.me();
					if (res.data.resultCode === ResultCode.success) {
						return true
					} else {
						// handleServerAppError(res.data, dispatch);
						return rejectWithValue(null)
					}
				} catch (error: any) {
					handleServerNetworkError(error, dispatch);
					return rejectWithValue(null)
				} finally {
					dispatch(appActions.setIsInitialized(true));
				}
			},)
		}
	},
	extraReducers: builder => {
		builder
			// .addMatcher(isAnyOf(authActions.login.fulfilled, authActions.logout.fulfilled, authActions.initializeApp.fulfilled),
			.addMatcher(isFulfilled(authActions.login, authActions.logout, authActions.initializeApp),
				(state, action: PayloadAction<boolean>) => {
					state.isLoggedIn = action.payload
				})
	}
});

export const authActions = slice.actions;
export const authSelectors = slice.selectors
export const authSlice = slice.reducer;

// Old Thunks
// export const loginTC = (data: ILoginParams) => async (dispatch: Dispatch) => {
// 	dispatch(appActions.setAppStatus("loading"));
// 	try {
// 		const res = await authAPI.login(data);
// 		if (res.data.resultCode === 0) {
// 			dispatch(setIsLoggedInAC(true));
// 		} else {
// 			handleServerAppError(res.data, dispatch);
// 		}
// 	} catch (error: any) {
// 		handleServerNetworkError(error, dispatch);
// 	} finally {
// 		dispatch(appActions.setAppStatus("succeeded"));
// 	}
// };
// export const logoutTC = () => (dispatch: Dispatch) => {
// 	dispatch(appActions.setAppStatus("loading"));
// 	authAPI
// 		.logout()
// 		.then((res) => {
// 			if (res.data.resultCode === 0) {
// 				dispatch(authActions.logout(false));
// 				dispatch(appActions.setAppStatus("succeeded"));
// 				dispatch(clearData());
// 			} else {
// 				handleServerAppError(res.data, dispatch);
// 			}
// 		})
// 		.catch((error) => {
// 			handleServerNetworkError(error, dispatch);
// 		});
// };
