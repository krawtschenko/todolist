import {useCallback, useEffect} from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {Navigate} from "react-router-dom";
import {tasksSelectors} from "features/tasks/model/tasksSlice";
import {AddItemForm} from "common/components/addItemForm/AddItemForm";
import {
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
	}, [])

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
									todoList={tl}
									tasks={tasks[tl.id]}
									entityStatus={tl.entityStatus}
									filter={tl.filter}
								/>
							</Paper>
						</Grid>
					);
				})}
			</Grid>
		</>
	);
};
