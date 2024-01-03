import { useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { TaskStatuses } from "../../api/api";
import { TodoList } from "./TodoList";
import { AddItemForm } from "../superForm/AddItemForm";
import { AppRootStateType, useAppDispatch, useAppSelector } from "../../state/store";
import {
  addTaskTC,
  deleteTaskTC,
  ITasksStateType,
  updateTaskTC,
} from "../../state/tasksReducer/tasksReducer";
import {
  addTodoListTC,
  changeTodoListFilterAC,
  changeTodoListTitleTC,
  fetchTodoListsTC,
  FilterType,
  ITodoListDomain,
  removeTodoListTC,
} from "../../state/todoListsReducer/todoListsReducer";
import { Navigate } from "react-router-dom";

export const TodoListsList = () => {
  // State ----------------------------------------------------------------------------------------------------
  const todoLists = useAppSelector((state) => state.todoLists);
  const tasks = useAppSelector((state) => state.tasks);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(fetchTodoListsTC());
  }, []);

  // Tasks ----------------------------------------------------------------------------------------------------
  const removeTask = useCallback(
    (id: string, todoListId: string) => {
      dispatch(deleteTaskTC(todoListId, id));
    },
    [dispatch]
  );

  const addTask = useCallback(
    (title: string, todoListId: string) => {
      dispatch(addTaskTC(todoListId, title));
    },
    [dispatch]
  );

  const changeStatus = useCallback(
    (id: string, status: TaskStatuses, todoListId: string) => {
      dispatch(updateTaskTC(todoListId, id, { status }));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    (id: string, title: string, todoListId: string) => {
      dispatch(updateTaskTC(todoListId, id, { title }));
    },
    [dispatch]
  );

  // TodoList -------------------------------------------------------------------------------------------------
  const changeFilter = useCallback(
    (value: FilterType, todoListId: string) => {
      dispatch(changeTodoListFilterAC({ todoListId, filter: value }));
    },
    [dispatch]
  );

  const removeTodoList = useCallback(
    (todoListId: string) => {
      dispatch(removeTodoListTC(todoListId));
    },
    [dispatch]
  );

  const changeTodoListTitle = useCallback(
    (id: string, title: string) => {
      dispatch(changeTodoListTitleTC(id, title));
    },
    [dispatch]
  );

  const addTodoList = useCallback(
    (title: string) => {
      dispatch(addTodoListTC(title));
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodoList} />
      </Grid>
      <Grid container spacing={3}>
        {todoLists.map((tl) => {
          return (
            <Grid key={tl.id} item>
              <Paper style={{ padding: "10px" }}>
                <TodoList
                  key={tl.id}
                  id={tl.id}
                  title={tl.title}
                  tasks={tasks[tl.id]}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  entityStatus={tl.entityStatus}
                  changeTaskStatus={changeStatus}
                  filter={tl.filter}
                  removeTodoList={removeTodoList}
                  changeTaskTitle={changeTaskTitle}
                  changeTodoListTitle={changeTodoListTitle}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
