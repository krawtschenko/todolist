import {memo, useEffect} from "react";
import {AddItemForm} from "common/components/addItemForm/AddItemForm";
import {EditableSpan} from "common/components/editableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {Task} from "features/tasks/ui/Task";
import {FilterType, ITodoListDomain, todoListsActions} from "features/todoLists/model/todoListsSlice";
import {RequestStatusType} from "app/model/appSlice";
import {tasksThunks} from "features/tasks/model/tasksSlice";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {TaskStatuses} from "common/enums";
import {ITask} from "common/interfaces";
import {FilterTasksButtons} from "features/todoLists/ui/FilterTasksButtons";
import {Tasks} from "features/tasks/ui/Tasks";
import {TodoListTitle} from "features/todoLists/ui/TodoListTitle";

interface PropsType {
	todoList: ITodoListDomain
	tasks: ITask[]
	entityStatus: RequestStatusType
	filter: FilterType
}

export const TodoList = memo(({todoList, ...props}: PropsType) => {
	const {id, title} = todoList
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(tasksThunks.fetchTasks(id));
	}, []);

	const addTask = (title: string) => {
		dispatch(tasksThunks.addTask({todoListId: id, title}));
	}

	return (
		<div>
			<TodoListTitle todoList={todoList}/>
			<AddItemForm addItem={addTask} disabled={props.entityStatus === "loading"}/>
			<Tasks todoList={todoList} tasks={props.tasks}/>
			<div>
				<FilterTasksButtons todoList={todoList}/>
			</div>
		</div>
	);
});
