import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';

export type FilterValuesType = "all" | "active" | "completed";

interface TodolistsType {
	id: string
	title: string
	filter: FilterValuesType
}

function App() {
	let todolistID1 = crypto.randomUUID();
	let todolistID2 = crypto.randomUUID();

	let [todoLists, setTodoLists] = useState<TodolistsType[]>([
		{id: todolistID1, title: 'What to learn', filter: 'all'},
		{id: todolistID2, title: 'What to buy', filter: 'all'},
	])

	let [tasks, setTasks] = useState({
		[todolistID1]: [
			{id: crypto.randomUUID(), title: "HTML&CSS", isDone: true},
			{id: crypto.randomUUID(), title: "JS", isDone: true},
			{id: crypto.randomUUID(), title: "ReactJS", isDone: false},
			{id: crypto.randomUUID(), title: "Rest API", isDone: false},
			{id: crypto.randomUUID(), title: "GraphQL", isDone: false},
		],
		[todolistID2]: [
			{id: crypto.randomUUID(), title: "HTML&CSS2", isDone: true},
			{id: crypto.randomUUID(), title: "JS2", isDone: true},
			{id: crypto.randomUUID(), title: "ReactJS2", isDone: false},
			{id: crypto.randomUUID(), title: "Rest API2", isDone: false},
			{id: crypto.randomUUID(), title: "GraphQL2", isDone: false},
		]
	});


	function removeTask(todoListID: string, taskId: string) {
		let filteredTasks = {...tasks, [todoListID]: tasks[todoListID].filter(t => t.id != taskId)}
		setTasks(filteredTasks);
	}

	function addTask(todoListID: string, title: string) {
		let task = {id: crypto.randomUUID(), title: title, isDone: false};
		let newTasks = {...tasks, [todoListID]: [task, ...tasks[todoListID]]};
		setTasks(newTasks);
	}

	function changeStatus(todoListID: string, taskId: string, isDone: boolean) {
		setTasks({...tasks, [todoListID]: tasks[todoListID].map(el => el.id === taskId ? {...el, isDone} : el)});
	}

	return (
		<div className="App">
			{todoLists.map(item => {
				let tasksForTodolist = tasks[item.id];

				if (item.filter === "active") {
					tasksForTodolist = tasks[item.id].filter(t => t.isDone === false);
				}
				if (item.filter === "completed") {
					tasksForTodolist = tasks[item.id].filter(t => t.isDone === true);
				}

				function changeFilter(value: FilterValuesType) {
					setTodoLists(todoLists.map(e => e.id === item.id ? {...e, filter: value} : e))
				}

				return (
					<Todolist key={item.id}
					          todoListID={item.id}
					          title={item.title}
					          tasks={tasksForTodolist}
					          removeTask={removeTask}
					          changeFilter={changeFilter}
					          addTask={addTask}
					          changeTaskStatus={changeStatus}
					          filter={item.filter}
					/>
				)
			})}
		</div>
	);
}

export default App;
