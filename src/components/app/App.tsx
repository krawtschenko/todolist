import React, {useCallback} from 'react';
import './App.css';
import {AddItemForm} from '../superForm/AddItemForm';
import AppBar from '@mui/material/AppBar/AppBar';
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import {Menu} from "@mui/icons-material";
import {TodoList} from "../todoList/Todolist";
import {
	addTodoListAC,
	changeTodoListFilterAC,
	changeTodoListTitleAC,
	removeTodoListAC,
} from "../../state/todoListsReducer/todoListsReducer";
import {
	addTaskAC,
	changeTaskStatusAC,
	changeTaskTitleAC,
	removeTaskAC,
} from "../../state/tasksReducer/tasksReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";

export type FilterType = "all" | "active" | "completed";
export type TodoListType = {
	id: string
	title: string
	filter: FilterType
}
export type TasksStateType = {
	[key: string]: Array<TaskType>
}

export type TaskType = {
	id: string
	title: string
	isDone: boolean
}

function App() {
	// State ----------------------------------------------------------------------------------------------------
	const todoLists = useSelector<AppRootStateType, TodoListType[]>(state => state.todoLists)
	const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

	const dispatch = useDispatch()

// Tasks ------------------------------------------------------------------------------------------------------
	const removeTask = useCallback((id: string, todoListId: string) => {
		dispatch(removeTaskAC(id, todoListId))
	}, [dispatch])

	const addTask = useCallback((title: string, todoListId: string) => {
		dispatch(addTaskAC(todoListId, title))
	}, [dispatch])

	const changeStatus = useCallback((id: string, isDone: boolean, todoListId: string) => {
		dispatch(changeTaskStatusAC(id, todoListId, isDone))
	}, [dispatch])

	const changeTaskTitle = useCallback((id: string, newTitle: string, todoListId: string) => {
		dispatch(changeTaskTitleAC(id, todoListId, newTitle))
	}, [dispatch])

// TodoList ---------------------------------------------------------------------------------------------------
	const changeFilter = useCallback((value: FilterType, todoListId: string) => {
		dispatch(changeTodoListFilterAC(todoListId, value))
	}, [dispatch])

	const removeTodoList = useCallback((id: string) => {
		dispatch(removeTodoListAC(id))
	}, [dispatch])

	const changeTodoListTitle = useCallback((id: string, title: string) => {
		dispatch(changeTodoListTitleAC(id, title))
	}, [dispatch])

	const addTodoList = useCallback((title: string) => {
		dispatch(addTodoListAC(title))
	}, [dispatch])

	return (
		<div className="App">
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" color="inherit" aria-label="menu">
						<Menu/>
					</IconButton>
					<Button color="inherit">Login</Button>
				</Toolbar>
			</AppBar>
			<Container fixed>
				<Grid container style={{padding: "20px"}}>
					<AddItemForm addItem={addTodoList}/>
				</Grid>
				<Grid container spacing={3}>
					{
						todoLists.map(tl => {
							return <Grid key={tl.id} item>
								<Paper style={{padding: "10px"}}>
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
						})
					}
				</Grid>
			</Container>
		</div>
	);
}

export default App;
