import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  legacy_createStore,
} from "redux";
import { tasksReducer } from "./tasksReducer/tasksReducer";
import { todoListsReducer } from "./todoListsReducer/todoListsReducer";
import { ThunkDispatch, thunk } from "redux-thunk";
import { useDispatch } from "react-redux";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
});

// непосредственно создаём store
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;

// Типизация Thunk
export type thunkDispatchType = ThunkDispatch<
  AppRootStateType,
  unknown,
  AnyAction
>;
export const useAppDispatch = useDispatch<thunkDispatchType>;
