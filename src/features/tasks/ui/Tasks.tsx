import React from 'react';
import {ITodoListDomain} from "features/todoLists/model/todoListsSlice";
import {ITask} from "common/interfaces";
import {TaskStatuses} from "common/enums";
import {Task} from "features/tasks/ui/Task";

interface Props {
	todoList: ITodoListDomain
	tasks: ITask[]
}

export const Tasks = ({todoList, tasks}: Props) => {
	let todoListTasks = tasks;

	if (todoList.filter === "active") {
		todoListTasks = todoListTasks.filter((t) => t.status !== TaskStatuses.Completed);
	}
	if (todoList.filter === "completed") {
		todoListTasks = todoListTasks.filter((t) => t.status === TaskStatuses.Completed);
	}

	return (
		<div>
			{
				todoListTasks.map((t) => {
					return (
						<Task
							key={t.id}
							task={t}
							todoListId={t.todoListId}
						/>
					);
				})
			}
		</div>
	);
}