import React from "react";
import { Provider } from "react-redux";
import { tasksReducer } from "./tasksSlice/tasksSlice";
import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses } from "../api/api";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { todoListsReducer } from "state/todoListsSlice/todoListsSlice";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
});

const initialGlobalState: any = {
  todoLists: [
    {
      id: "todoListId1",
      title: "What to learn",
      addedDate: new Date(),
      order: 1,
      filter: "all",
    },
    {
      id: "todoListId2",
      title: "What to buy",
      addedDate: new Date(),
      order: 1,
      filter: "all",
    },
  ],
  tasks: {
    ["todoListId1"]: [
      {
        description: "",
        title: "HTML",
        status: TaskStatuses.Completed,
        priority: TaskPriorities.Middle,
        startDate: new Date(),
        deadline: new Date(),
        id: v1(),
        todoListId: "todoListId1",
        order: 0,
        addedDate: new Date(),
      },
      {
        description: "",
        title: "JS",
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: new Date(),
        deadline: new Date(),
        id: v1(),
        todoListId: "todoListId1",
        order: 0,
        addedDate: new Date(),
      },
    ],
    ["todoListId2"]: [
      {
        description: "",
        title: "bread",
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: new Date(),
        deadline: new Date(),
        id: v1(),
        todoListId: "todoListId2",
        order: 0,
        addedDate: new Date(),
      },
      {
        description: "",
        title: "milk",
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: new Date(),
        deadline: new Date(),
        id: v1(),
        todoListId: "todoListId2",
        order: 0,
        addedDate: new Date(),
      },
    ],
  },
  app: { status: "idle" },
};

// const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType);
const storyBookStore = configureStore({
  reducer: rootReducer,
});

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
