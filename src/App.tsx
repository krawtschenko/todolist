import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./components/TodoList";

export const App = () => {
	const todoListTitle1: string = "What to do"

	const [tasks, setTasks] = useState<Array<TaskType>>([
		{id: 1, isDone: true, title: "HTML&CSS"},
		{id: 2, isDone: true, title: "JavaScript"},
		{id: 3, isDone: false, title: "React"}
	])

	const [filter, setFilter] = useState<FilterType>(FilterType.All)

	const removeTask = (idTask: number) => {
		setTasks(tasks.filter(el => el.id !== idTask))
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
			<TodoList tasks={filteredTasks} title={todoListTitle1} removeTask={removeTask} filters={changeFilter}/>
		</div>
	);
}

export interface TaskType {
	id: number
	title: string
	isDone: boolean
}

export enum FilterType {
	All = 'All',
	Active = 'Active',
	Completed = 'Completed'
}