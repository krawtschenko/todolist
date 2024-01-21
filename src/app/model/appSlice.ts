import {PayloadAction, createSlice} from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
// export type AppInitialStateType = ReturnType<typeof slice.getInitialState>;

const slice = createSlice({
	name: "app",
	initialState: {
		status: "idle" as RequestStatusType,
		error: null as null | string,
		isInitialized: false,
	},
	selectors: {
		selectStatus: sliceState => sliceState.status
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
export const appSelectors = slice.selectors
export default slice.reducer;
