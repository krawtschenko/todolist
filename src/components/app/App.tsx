import React from 'react';
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
	function removeTask(id: string, todoListId: string) {
		dispatch(removeTaskAC(id, todoListId))
	}

	function addTask(title: string, todoListId: string) {
		dispatch(addTaskAC(todoListId, title))
	}

	function changeStatus(id: string, isDone: boolean, todoListId: string) {
		dispatch(changeTaskStatusAC(id, todoListId, isDone))
	}

	function changeTaskTitle(id: string, newTitle: string, todoListId: string) {
		dispatch(changeTaskTitleAC(id, todoListId, newTitle))
	}

// TodoList ---------------------------------------------------------------------------------------------------
	function changeFilter(value: FilterType, todoListId: string) {
		dispatch(changeTodoListFilterAC(todoListId, value))
	}

	function removeTodoList(id: string) {
		dispatch(removeTodoListAC(id))
	}

	function changeTodoListTitle(id: string, title: string) {
		dispatch(changeTodoListTitleAC(id, title))
	}

	function addTodoList(title: string) {
		dispatch(addTodoListAC(title))
	}

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
							let allTodoListTasks: Array<TaskType> = tasks[tl.id];
							let tasksForTodoList = allTodoListTasks;

							if (tl.filter === "active") {
								tasksForTodoList = allTodoListTasks.filter(t => !t.isDone);
							}
							if (tl.filter === "completed") {
								tasksForTodoList = allTodoListTasks.filter(t => t.isDone);
							}

							return <Grid key={tl.id} item>
								<Paper style={{padding: "10px"}}>
									<TodoList
										key={tl.id}
										id={tl.id}
										title={tl.title}
										tasks={tasksForTodoList}
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
