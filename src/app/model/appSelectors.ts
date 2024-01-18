import {RootState} from "app/store";

export const selectAppSlice = {
	status: (state: RootState) => state.appSlice.status,
	error: (state: RootState) => state.appSlice.error,
	isInitialized: (state: RootState) => state.appSlice.isInitialized,
};