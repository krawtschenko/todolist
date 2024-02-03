import {PayloadAction, createSlice, isPending, isRejected, isFulfilled} from "@reduxjs/toolkit";
import {todoListsActions} from "features/todoLists/model/todoListsSlice";

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
			// .addMatcher((action: UnknownAction) => {
			// 	return action.type.endsWith('/pending')
			// }, (state, action) => {
			// 	state.status = 'loading'
			// })
			.addMatcher(isPending, (state) => {
				state.status = 'loading'
			})
			.addMatcher(isRejected, (state, action: any) => {
				state.status = 'failed'
				if (action.payload) {
					if (action.type === todoListsActions.createTodoListTC.rejected.type) return
					state.error = action.error.message[0]
				} else {
					state.error = action.error.message ? action.error.message : 'Some error occurred'
				}
			})
			.addMatcher(isFulfilled, (state) => {
				state.status = 'succeeded'
			})
	}
});

export const appActions = slice.actions;
export const appSelectors = slice.selectors
export const appSlice = slice.reducer;
