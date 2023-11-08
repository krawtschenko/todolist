import React, {useState} from 'react';
import './App.css';
import {AddItemForm} from '../superForm/AddItemForm';
import AppBar from '@mui/material/AppBar/AppBar';
import {Button, Container, Grid, IconButton, Paper, Toolbar} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TaskType, TodoList} from "../todoList/Todolist";
import {v1} from "uuid";

export type FilterType = "all" | "active" | "completed";
export type TodoListType = {
	id: string
	title: string
	filter: FilterType
}
export type TasksStateType = {
	[key: string]: Array<TaskType>
}

function App() {
	// State ----------------------------------------------------------------------------------------------------
	let todoListId1 = v1();
	let todoListId2 = v1();

	let [todoLists, setTodoLists] = useState<Array<TodoListType>>([
		{id: todoListId1, title: "What to learn", filter: "all"},
		{id: todoListId2, title: "What to buy", filter: "all"}
	])

	let [tasks, setTasks] = useState<TasksStateType>({
		[todoListId1]: [
			{id: v1(), title: "HTML&CSS", isDone: true},
			{id: v1(), title: "JS", isDone: true}
		],
		[todoListId2]: [
			{id: v1(), title: "Milk", isDone: true},
			{id: v1(), title: "React Book", isDone: true}
		]
	});

// Tasks ------------------------------------------------------------------------------------------------------
	function removeTask(id: string, todoListId: string) {
		//достанем нужный массив по todoListId:
		let todoListTasks = tasks[todoListId];
		// перезапишем в этом объекте массив для нужного тудулиста отфилтрованным массивом:
		tasks[todoListId] = todoListTasks.filter(t => t.id !== id);
		// засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
		setTasks({...tasks});
	}

	function addTask(title: string, todoListId: string) {
		let task = {id: v1(), title: title, isDone: false};
		//достанем нужный массив по todoListId:
		let todoListTasks = tasks[todoListId];
		// перезапишем в этом объекте массив для нужного тудулиста копией, добавив в начало новую таску:
		tasks[todoListId] = [task, ...todoListTasks];
		// засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
		setTasks({...tasks});
	}

	function changeStatus(id: string, isDone: boolean, todoListId: string) {
		//достанем нужный массив по todoListId:
		let todoListTasks = tasks[todoListId];
		// найдём нужную таску:
		let task = todoListTasks.find(t => t.id === id);
		//изменим таску, если она нашлась
		if (task) {
			task.isDone = isDone;
			// засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
			setTasks({...tasks});
		}
	}

	function changeTaskTitle(id: string, newTitle: string, todoListId: string) {
		//достанем нужный массив по todoListId:
		let todoListTasks = tasks[todoListId];
		// найдём нужную таску:
		let task = todoListTasks.find(t => t.id === id);
		//изменим таску, если она нашлась
		if (task) {
			task.title = newTitle;
			// засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
			setTasks({...tasks});
		}
	}

// TodoList ---------------------------------------------------------------------------------------------------
	function changeFilter(value: FilterType, todoListId: string) {
		let todoList = todoLists.find(tl => tl.id === todoListId);
		if (todoList) {
			todoList.filter = value;
			setTodoLists([...todoLists])
		}
	}

	function removeTodoList(id: string) {
		// засунем в стейт список тудулистов, id которых не равны тому, который нужно выкинуть
		setTodoLists(todoLists.filter(tl => tl.id !== id));
		// удалим таски для этого тудулиста из второго стейта, где мы храним отдельно таски
		delete tasks[id]; // удаляем св-во из объекта... значением которого являлся массив тасок
		// засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
		setTasks({...tasks});
	}

	function changeTodoListTitle(id: string, title: string) {
		// найдём нужный todoList
		const todoList = todoLists.find(tl => tl.id === id);
		if (todoList) {
			// если нашёлся - изменим ему заголовок
			todoList.title = title;
			setTodoLists([...todoLists]);
		}
	}

	function addTodoList(title: string) {
		let newTodoListId = v1();
		let newTodoList: TodoListType = {id: newTodoListId, title: title, filter: 'all'};
		setTodoLists([newTodoList, ...todoLists]);
		setTasks({
			...tasks,
			[newTodoListId]: []
		})
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
							let allTodoListTasks = tasks[tl.id];
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
