import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList";
// import * as crypto from "crypto";

export const App = () => {
	const todoListTitle1: string = "What to do"

	const [tasks, setTasks] = useState<TaskType[]>([
		{id: crypto.randomUUID(), isDone: true, title: "HTML&CSS"},
		{id: crypto.randomUUID(), isDone: true, title: "JavaScript"},
		{id: crypto.randomUUID(), isDone: false, title: "React"}
	])

	const [filter, setFilter] = useState<FilterType>(FilterType.All)

	const removeTask = (idTask: string) => {
		setTasks(tasks.filter(el => el.id !== idTask))
	}

	const addTask = (title: string) => {
		setTasks([...tasks, {id: crypto.randomUUID(), isDone: false, title}])
	}

	const changeFilter = (filter: FilterType) => {
		setFilter(filter)
	}

	let filteredTasks: Array<TaskType> = tasks

	if (filter === 'Active') {
		filteredTasks = tasks.filter(el => !el.isDone)
	}
	if (filter === 'Completed') {
		filteredTasks = tasks.filter(el => el.isDone)
	}

	return (
		<div className="App">
			<TodoList tasks={filteredTasks} title={todoListTitle1} removeTask={removeTask} filters={changeFilter}
			          addTask={addTask}/>
		</div>
	);
}

export interface TaskType {
	id: string
	title: string
	isDone: boolean
}

export enum FilterType {
	All = 'All',
	Active = 'Active',
	Completed = 'Completed'
}