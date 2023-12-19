import { useCallback, useEffect } from "react";
import "./App.css";
import { AddItemForm } from "../superForm/AddItemForm";
import AppBar from "@mui/material/AppBar/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import { Menu } from "@mui/icons-material";
import {
  FilterType,
  ITodoListDomain,
  addTodoListAC,
  changeTodoListFilterAC,
  changeTodoListTitleAC,
  removeTodoListTC,
  fetchTodoListsTC,
  removeTodoListAC,
  addTodoListTC,
  changeTodoListTitleTC,
} from "../../state/todoListsReducer/todoListsReducer";
import {
  ITasksStateType,
  addTaskTC,
  deleteTaskTC,
  updateTaskTC,
} from "../../state/tasksReducer/tasksReducer";
import { useSelector } from "react-redux";
import { AppRootStateType, useAppDispatch } from "../../state/store";
import { TaskStatuses } from "../../api/api";
import { TodoList } from "../todoList/TodoList";

function App() {
  // State ----------------------------------------------------------------------------------------------------
  const todoLists = useSelector<AppRootStateType, ITodoListDomain[]>((state) => state.todoLists);
  const tasks = useSelector<AppRootStateType, ITasksStateType>((state) => state.tasks);

  const dispatch = useAppDispatch();

  useEffect(() => {
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
      dispatch(changeTodoListFilterAC(todoListId, value));
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

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
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
      </Container>
    </div>
  );
}

export default App;
