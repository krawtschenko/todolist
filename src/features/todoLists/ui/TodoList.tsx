import {memo, useEffect} from "react";
import {AddItemForm} from "common/components/addItemForm/AddItemForm";
import {FilterType, ITodoListDomain} from "features/todoLists/model/todoListsSlice";
import {RequestStatusType} from "app/model/appSlice";
import {tasksThunks} from "features/tasks/model/tasksSlice";
import {useAppDispatch} from "common/hooks/useAppDispatch";
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
	const {id} = todoList
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(tasksThunks.fetchTasks(id));
	}, []);

	const addTask = (title: string) => {
		return dispatch(tasksThunks.addTask({todoListId: id, title}));
	}

	return (
		<div>
			<TodoListTitle todoList={todoList}/>
			<AddItemForm addItem={addTask} disabled={props.entityStatus === "loading"}/>
			<Tasks todoList={todoList} tasks={props.tasks}/>
			<FilterTasksButtons todoList={todoList}/>
		</div>
	);
});
