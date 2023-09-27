import React, {useState} from 'react';
import './App.css';
import TodoList from "./components/TodoList";
import styled from "styled-components";

const ContainerEl = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 285px));
`

export const App = () => {
	const todoListTitle1: string = "Heroes of Warcraft"

	const [tasks, setTasks] = useState<ITasks[]>([
		{id: crypto.randomUUID(), isDone: true, title: "Zul'jin"},
		{id: crypto.randomUUID(), isDone: true, title: "Jaina"},
		{id: crypto.randomUUID(), isDone: false, title: "Thrall"},
		{id: crypto.randomUUID(), isDone: true, title: "Uther"},
		{id: crypto.randomUUID(), isDone: false, title: "Arthas"}
	])

	const [filter, setFilter] = useState<EFilter>(EFilter.All)

	function removeTask(taskId: string) {
		setTasks(tasks.filter(el => el.id !== taskId))
	}

	function changeFilter(filter: EFilter) {
		setFilter(filter)
	}

	function addTask(title: string) {
		const newTask = {id: crypto.randomUUID(), isDone: false, title}
		setTasks([newTask, ...tasks])
	}

	function filterTasks() {
		switch (filter) {
			case EFilter.Active:
				return tasks.filter(el => !el.isDone)
			case EFilter.Completed:
				return tasks.filter(el => el.isDone)
			default:
				return tasks
		}
	}

	const filteredTasks = filterTasks()

	return (
		<div className="App">
			<ContainerEl>
				<TodoList title={todoListTitle1} tasks={filteredTasks} removeTask={removeTask} changeFilter={changeFilter}
				          addTask={addTask}/>
			</ContainerEl>
		</div>
	);
}

export interface ITasks {
	id: string
	isDone: boolean
	title: string
}

export enum EFilter {
	All = 'All',
	Active = 'Active',
	Completed = 'Completed'
}