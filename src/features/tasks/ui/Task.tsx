import {ChangeEvent, memo} from "react";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "common/components/editableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {TaskStatuses} from "common/enums";
import {ITask} from "common/interfaces";
import {tasksThunks} from "features/tasks/model/tasksSlice";
import {useAppDispatch} from "common/hooks/useAppDispatch";

interface props {
	task: ITask;
	todoListId: string
}

export const Task = memo(({task}: props) => {
	const dispatch = useAppDispatch()

	const removeTask = () => {
		dispatch(tasksThunks.removeTask({todoListId: task.todoListId, taskId: task.id}));
	}

	const changeStatus = (e: ChangeEvent<HTMLInputElement>) => {
		const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.InProgress
		dispatch(tasksThunks.updateTask({todoListId: task.todoListId, taskId: task.id, taskModel: {status}}));
	}

	const changeTaskTitle = (title: string) => {
		dispatch(tasksThunks.updateTask({todoListId: task.todoListId, taskId: task.id, taskModel: {title}}));
	}

	return (
		<div className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
			<Checkbox
				checked={task.status === TaskStatuses.Completed}
				color="primary"
				onChange={changeStatus}
			/>
			<EditableSpan
				value={task.title}
				onChange={(newValue) => changeTaskTitle(newValue)}
			/>
			<IconButton onClick={() => removeTask()}>
				<Delete/>
			</IconButton>
		</div>
	);
});
