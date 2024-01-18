import {useCallback, useEffect} from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {Navigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "state/store";
import {tasksThunks} from "state/tasksSlice/tasksSlice";
import {AddItemForm} from "components/superForm/AddItemForm";
import {TaskStatuses} from "api/api";
import {
	FilterType,
	changeTodoListTitleTC,
	todoListsActions,
} from "state/todoListsSlice/todoListsSlice";
import {selectAuthSlice, selectTasksSlice, selectTodoListsSlice} from "state/selectors";
import {TodoList} from "components/todoList/TodoList";

export const TodoListsList = () => {
	// State ----------------------------------------------------------------------------------------------------
	const todoLists = useAppSelector(selectTodoListsSlice.todoLists);
	const tasks = useAppSelector(selectTasksSlice.tasks);
	const isLoggedIn = useAppSelector(selectAuthSlice.isLoggedIn);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!isLoggedIn) return;
		dispatch(todoListsActions.fetchTodoListsTC());
	}, []);

	// Tasks ----------------------------------------------------------------------------------------------------
	const removeTask = useCallback(
		(taskId: string, todoListId: string) => {
			dispatch(tasksThunks.removeTask({todoListId, taskId}));
		},
		[dispatch]
	);

	const addTask = useCallback(
		(title: string, todoListId: string) => {
			dispatch(tasksThunks.addTask({todoListId, title}));
		},
		[dispatch]
	);

	const changeStatus = useCallback(
		(taskId: string, status: TaskStatuses, todoListId: string) => {
			dispatch(tasksThunks.updateTask({todoListId, taskId, taskModel: {status}}));
		},
		[dispatch]
	);

	const changeTaskTitle = useCallback(
		(taskId: string, title: string, todoListId: string) => {
			dispatch(tasksThunks.updateTask({todoListId, taskId, taskModel: {title}}));
		},
		[dispatch]
	);

	// TodoList -------------------------------------------------------------------------------------------------
	const changeFilter = useCallback(
		(value: FilterType, todoListId: string) => {
			dispatch(todoListsActions.changeTodoListFilterAC({todoListId, filter: value}));
		},
		[dispatch]
	);

	const removeTodoList = useCallback(
		(todoListId: string) => {
			dispatch(todoListsActions.removeTodoListTC({todoListId}));
		},
		[dispatch]
	);

	const changeTodoListTitle = useCallback(
		(id: string, title: string) => {
			dispatch(changeTodoListTitleTC(id, title));
		},
		[dispatch]
	);

	const addTodoList = useCallback(
		(title: string) => {
			dispatch(todoListsActions.createTodoListTC({title}));
		},
		[dispatch]
	);

	if (!isLoggedIn) {
		return <Navigate to={"/login"}/>;
	}

	return (
		<>
			<Grid container style={{padding: "20px"}}>
				<AddItemForm addItem={addTodoList}/>
			</Grid>
			<Grid container spacing={3}>
				{todoLists.map((tl) => {
					return (
						<Grid key={tl.id} item>
							<Paper style={{padding: "10px"}}>
								<TodoList
									key={tl.id}
									id={tl.id}
									title={tl.title}
									tasks={tasks[tl.id]}
									removeTask={removeTask}
									changeFilter={changeFilter}
									addTask={addTask}
									entityStatus={tl.entityStatus}
									changeTaskStatus={changeStatus}
									filter={tl.filter}
									removeTodoList={removeTodoList}
									changeTaskTitle={changeTaskTitle}
									changeTodoListTitle={changeTodoListTitle}
								/>
							</Paper>
						</Grid>
					);
				})}
			</Grid>
		</>
	);
};
