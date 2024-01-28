import {memo} from "react";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "common/components/editableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {TaskStatuses} from "common/enums";
import {ITask} from "common/interfaces";
import {tasksThunks} from "features/tasks/model/tasksSlice";
import {useAppDispatch} from "common/hooks/useAppDispatch";

interface ITaskProps {
	task: ITask;
}

export const Task = memo(({task}: ITaskProps) => {
	const dispatch = useAppDispatch()

	const removeTask = () => {
		dispatch(tasksThunks.removeTask({todoListId: task.todoListId, taskId: task.id}));
	}

	const changeStatus = (status: TaskStatuses) => {
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
				onChange={(e) => changeStatus(e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.InProgress)}
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
