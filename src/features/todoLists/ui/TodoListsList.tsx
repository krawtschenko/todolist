import {useCallback, useEffect} from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {Navigate} from "react-router-dom";
import {tasksSelectors, tasksThunks} from "features/tasks/model/tasksSlice";
import {AddItemForm} from "common/components/addItemForm/AddItemForm";
import {
	FilterType,
	todoListsActions, todoListsSelectors,
} from "features/todoLists/model/todoListsSlice";
import {TodoList} from "features/todoLists/ui/TodoList";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {useSelector} from "react-redux";
import {authSelectors} from "features/auth/model/authSlice";

export const TodoListsList = () => {
	// State ----------------------------------------------------------------------------------------------------
	const todoLists = useSelector(todoListsSelectors.selectTodoLists);
	const tasks = useSelector(tasksSelectors.selectTasks);
	const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);

	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!isLoggedIn) return;
		dispatch(todoListsActions.fetchTodoListsTC());
	}, []);

	// Tasks ----------------------------------------------------------------------------------------------------
	const addTask = useCallback(
		(title: string, todoListId: string) => {
			dispatch(tasksThunks.addTask({todoListId, title}));
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
		(todoListId: string, title: string) => {
			dispatch(todoListsActions.changeTodoListTitleTC({todoListId, title}));
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
		return <Navigate to={"/ui"}/>;
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
									changeFilter={changeFilter}
									addTask={addTask}
									entityStatus={tl.entityStatus}
									filter={tl.filter}
									removeTodoList={removeTodoList}
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
