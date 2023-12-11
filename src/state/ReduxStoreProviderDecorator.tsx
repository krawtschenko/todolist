import React from "react";
import { Provider } from "react-redux";
import { AppRootStateType } from "./store";
import { combineReducers, legacy_createStore } from "redux";
import { tasksReducer } from "./tasksReducer/tasksReducer";
import { todoListsReducer } from "./todoListsReducer/todoListsReducer";
import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses } from "../api/todoList_API";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todoLists: todoListsReducer,
});

const initialGlobalState: AppRootStateType = {
  todoLists: [
    {
      id: "todolistId1",
      title: "What to learn",
      addedDate: new Date(),
      order: 1,
      filter: "all",
    },
    {
      id: "todolistId2",
      title: "What to buy",
      addedDate: new Date(),
      order: 1,
      filter: "all",
    },
  ],
  tasks: {
    ["todolistId1"]: [
      {
        description: "",
        title: "HTML",
        completed: true,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: new Date(),
        deadline: new Date(),
        id: v1(),
        todoListId: "todolistId1",
        order: 0,
        addedDate: new Date(),
      },
      {
        description: "",
        title: "JS",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: new Date(),
        deadline: new Date(),
        id: v1(),
        todoListId: "todolistId1",
        order: 0,
        addedDate: new Date(),
      },
    ],
    ["todolistId2"]: [
      {
        description: "",
        title: "bread",
        completed: false,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: new Date(),
        deadline: new Date(),
        id: v1(),
        todoListId: "todolistId2",
        order: 0,
        addedDate: new Date(),
      },
      {
        description: "",
        title: "milk",
        completed: true,
        status: TaskStatuses.InProgress,
        priority: TaskPriorities.Middle,
        startDate: new Date(),
        deadline: new Date(),
        id: v1(),
        todoListId: "todolistId2",
        order: 0,
        addedDate: new Date(),
      },
    ],
  },
};

const storyBookStore = legacy_createStore(
  rootReducer,
  initialGlobalState as AppRootStateType
);

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
