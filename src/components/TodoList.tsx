import React, {FC} from "react";
import {FilterType, TaskType} from "../App";

export const TodoList: FC<TodoListProps> = ({title, tasks, removeTask, filters}) => {
	return (
		<div className="todoList">
			<h3>{title}</h3>
			<div>
				<input/>
				<button>+</button>
			</div>
			<ul>
				{
					tasks.length
						? tasks.map(el => {
							return (
								<li key={el.id}>
									<input type="checkbox" checked={el.isDone}/><span>{el.title}</span>
									<button onClick={() => removeTask(el.id)}>Delete</button>
								</li>
							)
						})
						: <span>Have no tasks</span>
				}
			</ul>
			<div>
				<button onClick={() => filters(FilterType.All)}>All</button>
				<button onClick={() => filters(FilterType.Active)}>Active</button>
				<button onClick={() => filters(FilterType.Completed)}>Completed</button>
			</div>
		</div>
	)
}

interface TodoListProps {
	title: string
	tasks: Array<TaskType>
	removeTask: (idTask: number) => void
	filters: (filter: FilterType) => void
}