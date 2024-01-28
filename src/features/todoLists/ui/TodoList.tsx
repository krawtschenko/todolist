import {memo, useEffect} from "react";
import {AddItemForm} from "common/components/addItemForm/AddItemForm";
import {EditableSpan} from "common/components/editableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {Task} from "features/tasks/ui/Task";
import {FilterType, todoListsActions} from "features/todoLists/model/todoListsSlice";
import {RequestStatusType} from "app/model/appSlice";
import {tasksThunks} from "features/tasks/model/tasksSlice";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {TaskStatuses} from "common/enums";
import {ITask} from "common/interfaces";

interface PropsType {
	todoListId: string;
	title: string;
	tasks: ITask[];
	entityStatus: RequestStatusType;
	filter: FilterType;
}

export const TodoList = memo((props: PropsType) => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(tasksThunks.fetchTasks(props.todoListId));
	}, []);

	const addTask = (title: string) => {
		dispatch(tasksThunks.addTask({todoListId: props.todoListId, title}));
	}

	const changeFilter = (value: FilterType) => {
		dispatch(todoListsActions.changeTodoListFilterAC({todoListId: props.todoListId, filter: value}));
	}

	const removeTodoList = () => {
		dispatch(todoListsActions.removeTodoListTC({todoListId: props.todoListId}));
	}

	const changeTodoListTitle = (title: string) => {
		dispatch(todoListsActions.changeTodoListTitleTC({todoListId: props.todoListId, title}));
	}

	// Buttons ----------------------------------------------------------------------------------------------------
	const onAllClickHandler = () => changeFilter("all")
	const onActiveClickHandler = () => changeFilter("active")
	const onCompletedClickHandler = () => changeFilter("completed")

	let todoListTasks = props.tasks;

	if (props.filter === "active") {
		todoListTasks = todoListTasks.filter((t) => t.status !== TaskStatuses.Completed);
	}
	if (props.filter === "completed") {
		todoListTasks = todoListTasks.filter((t) => t.status === TaskStatuses.Completed);
	}

	return (
		<div>
			<h3>
				<EditableSpan value={props.title} onChange={changeTodoListTitle}/>
				<IconButton onClick={removeTodoList} disabled={props.entityStatus === "loading"}>
					<Delete/>
				</IconButton>
			</h3>
			<AddItemForm addItem={addTask} disabled={props.entityStatus === "loading"}/>
			<div>
				{todoListTasks.map((t) => {
					return (
						<Task
							key={t.id}
							task={t}
							todoListId={props.todoListId}
						/>
					);
				})}
			</div>
			<div>
				<Button variant={props.filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler} color={"inherit"}>
					All
				</Button>
				<Button
					variant={props.filter === "active" ? "outlined" : "text"}
					onClick={onActiveClickHandler}
					color={"primary"}
				>
					Active
				</Button>
				<Button
					variant={props.filter === "completed" ? "outlined" : "text"}
					onClick={onCompletedClickHandler}
					color={"secondary"}
				>
					Completed
				</Button>
			</div>
		</div>
	);
});
