import React, {ChangeEvent, FC, useState} from "react";
import {FilterType, TaskType} from "../App";

export const TodoList: FC<TodoListProps> = ({title, tasks, removeTask, filters, addTask}) => {
	const allTasks = tasks.length ? tasks.map(el => {
		return (
			<li key={el.id}>
				<input type="checkbox" checked={el.isDone}/><span>{el.title}</span>
				<button onClick={() => removeTask(el.id)}>Delete</button>
			</li>
		)
	}) : <span>Have no tasks</span>

	const [input, setInput] = useState<string>('')

	const changeInput = (value: ChangeEvent<HTMLInputElement>) => {
		setInput(value.currentTarget.value)
	}

	const addTaskFn = () => {
		const titleNewTask = input.trim()
		if (titleNewTask && titleNewTask.length < 20) {
			addTask(input)
		}
		setInput('')
	}

	return (
		<div className="todoList">
			<h3>{title}</h3>
			<div>
				<input value={input} onChange={(event) => changeInput(event)}/>
				<button disabled={input.trim().length > 20} onClick={addTaskFn}>+</button>
				{/*<div><span>{input.trim().length > 20 || !input.trim() ? 'Error' : ''}</span></div>*/}
				<div><span>{input.trim().length > 20 ? 'So long' : 'Enter title'}</span></div>
			</div>
			<ul>
				{allTasks}
			</ul>
			<div>
				<button onClick={() => filters(FilterType.All)}>{FilterType.All}</button>
				<button onClick={() => filters(FilterType.Active)}>{FilterType.Active}</button>
				<button onClick={() => filters(FilterType.Completed)}>{FilterType.Completed}</button>
			</div>
		</div>
	)
}

interface TodoListProps {
	title: string
	tasks: Array<TaskType>
	removeTask: (idTask: string) => void
	filters: (filter: FilterType) => void
	addTask: (title: string) => void
}