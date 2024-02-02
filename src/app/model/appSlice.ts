import {PayloadAction, createSlice, UnknownAction, isPending, isRejected, isFulfilled} from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
	name: "app",
	initialState: {
		status: "idle" as RequestStatusType,
		error: null as null | string,
		isInitialized: false,
	},
	selectors: {
		selectStatus: sliceState => sliceState.status,
		selectError: sliceState => sliceState.error,
		selectIsInitialized: sliceState => sliceState.isInitialized
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
	extraReducers: builder => {
		builder
			.addMatcher(isPending, (state, action) => {
				state.status = 'loading'
			})
			.addMatcher(isRejected, (state, action) => {
				state.status = 'failed'
			})
			.addMatcher(isFulfilled, (state, action) => {
				state.status = 'succeeded'
			})
	}
});

export const appActions = slice.actions;
export const appSelectors = slice.selectors
export const appSlice = slice.reducer;
