import {PayloadAction, asyncThunkCreator, buildCreateSlice} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {RequestStatusType, appActions} from "app/model/appSlice";
import {clearData} from "common/actions/commonActions";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {ITodoList} from "common/interfaces";
import {todoListsAPI} from "features/todoLists/api/todoListsAPI";
import {ResultCode} from "common/enums";

export type FilterType = "all" | "active" | "completed";

export interface ITodoListDomain extends ITodoList {
	filter: FilterType;
	entityStatus: RequestStatusType;
}

const createAppSlice = buildCreateSlice({
	creators: {asyncThunk: asyncThunkCreator},
});

const slice = createAppSlice({
	name: "todoLists",
	initialState: [] as ITodoListDomain[],
	selectors: {
		selectTodoLists: (sliceState) => sliceState
	},
	reducers: (creators) => {
		const createAThunk = creators.asyncThunk.withTypes<{ rejectValue: null }>();
		return {
			changeTodoListFilterAC: creators.reducer(
				(state, action: PayloadAction<{ todoListId: string; filter: FilterType }>) => {
					// 1 var
					const todoList = state.find((e) => e.id === action.payload.todoListId);
					if (todoList) {
						todoList.filter = action.payload.filter;
					}
					// 2 var
					// const index = state.findIndex((e) => e.id === action.payload.todoListId);
					// if (index > -1) {
					//   state[index].filter = action.payload.filter;
					// }

					// 3 var
					// return state.map((t) => (t.id === action.payload.todoListId ? { ...t, filter: action.payload.filter } : t));
				}
			),
			changeTodoListEntityStatusAC: creators.reducer(
				(state, action: PayloadAction<{ todoListId: string; status: RequestStatusType }>) => {
					// 1 var
					const todoList = state.find((e) => e.id === action.payload.todoListId);
					if (todoList) {
						todoList.entityStatus = action.payload.status;
					}
					// 2 var
					// return state.map((t) => (t.id === action.payload.todoListId ? { ...t, entityStatus: action.payload.status } : t));
				}
			),

			// Thunks
			fetchTodoListsTC: createAThunk<undefined, ITodoList[]>(
				async (_, thunkAPI) => {
					const {dispatch, rejectWithValue} = thunkAPI;
					dispatch(appActions.setAppStatus("loading"));
					try {
						const res = await todoListsAPI.getTodoLists();
						return res.data;
					} catch (error) {
						handleServerNetworkError(error, dispatch);
						return rejectWithValue(null);
					} finally {
						dispatch(appActions.setAppStatus("succeeded"));
					}
				},
				{
					fulfilled: (state, action) => {
						action.payload.forEach((t) => {
							state.push({...t, filter: "all", entityStatus: "idle"});
						});
					},
				}
			),
			createTodoListTC: createAThunk<{ title: string }, ITodoList>(async (arg, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI
				dispatch(appActions.setAppStatus("loading"));
				try {
					const res = await todoListsAPI.createTodoList(arg.title);
					const todoList = res.data.data.item
					if (res.data.resultCode === ResultCode.success) {
						return todoList
					} else {
						handleServerAppError(res.data, dispatch);
						return rejectWithValue(null);
					}
				} catch (error) {
					handleServerNetworkError(error, dispatch);
					return rejectWithValue(null);
				} finally {
					dispatch(appActions.setAppStatus("succeeded"));
				}
			}, {
				fulfilled: (state, action) => {
					state.unshift({...action.payload, filter: "all", entityStatus: "succeeded"});
				}
			}),
			removeTodoListTC: createAThunk<{ todoListId: string }, { todoListId: string }>(async (arg, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI

				dispatch(appActions.setAppStatus("loading"));
				dispatch(todoListsActions.changeTodoListEntityStatusAC({todoListId: arg.todoListId, status: "loading"}));

				try {
					await todoListsAPI.deleteTodoList(arg.todoListId);
					return arg
				} catch (error: any) {
					handleServerNetworkError(error, dispatch);
					return rejectWithValue(null)
				} finally {
					dispatch(appActions.setAppStatus("succeeded"));
				}
			}, {
				fulfilled: (state, action) => {
					// 1 var
					const index = state.findIndex((e) => e.id === action.payload.todoListId);
					if (index > -1) {
						state.splice(index, 1);
					}
				}
			}),
			changeTodoListTitleTC: createAThunk<{ todoListId: string, title: string }, {
				todoListId: string,
				title: string
			}>(async (arg, thunkAPI) => {
				const {dispatch, rejectWithValue} = thunkAPI

				dispatch(appActions.setAppStatus("loading"));
				try {
					await todoListsAPI.updateTodoList(arg);
					return arg
				} catch (error) {
					handleServerNetworkError(error, dispatch);
					return rejectWithValue(null)
				} finally {
					dispatch(appActions.setAppStatus("succeeded"));
				}
			}, {
				fulfilled: (state, action) => {
					// 1 var
					const todoList = state.find((e) => e.id === action.payload.todoListId);
					if (todoList) {
						todoList.title = action.payload.title;
					}
					// 2 var
					// return state.map((t) => (t.id === action.payload.todoListId ? { ...t, title: action.payload.title } : t));
				}
			})
		};
	},
	extraReducers: (builder) => {
		builder.addCase(clearData.type, () => {
			return [];
		});
	},
});

export const todoListsSlice = slice.reducer;
export const todoListsActions = slice.actions;
export const todoListsSelectors = slice.selectors
