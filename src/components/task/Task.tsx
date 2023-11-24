import React, {FC, memo} from 'react';
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "../superSpan/EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {TaskType} from "../app/App";

interface ITask {
	task: TaskType
	removeTask: (taskId: string) => void
	changeTaskStatus: (id: string, isDone: boolean) => void
	changeTaskTitle: (taskId: string, newTitle: string) => void
}

export const Task: FC<ITask> = memo(({task, ...props}) => {
	console.log('Task')

	return (
		<div className={task.isDone ? "is-done" : ""}>
			<Checkbox
				checked={task.isDone}
				color="primary"
				onChange={(e) => props.changeTaskStatus(task.id, e.currentTarget.checked)}
			/>
			<EditableSpan value={task.title} onChange={(newValue) => props.changeTaskTitle(task.id, newValue)}/>
			<IconButton onClick={() => props.removeTask(task.id)}>
				<Delete/>
			</IconButton>
		</div>
	);
})