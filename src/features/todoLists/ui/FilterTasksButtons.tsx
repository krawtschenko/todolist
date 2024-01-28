import React from 'react';
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {FilterType, ITodoListDomain, todoListsActions} from "features/todoLists/model/todoListsSlice";
import Button from "@mui/material/Button";

interface Props {
	todoList: ITodoListDomain
}

export const FilterTasksButtons = ({todoList}: Props) => {
	const dispatch = useAppDispatch()

	const changeFilterHandler = (filter: FilterType) => {
		dispatch(todoListsActions.changeTodoListFilterAC({todoListId: todoList.id, filter}));
	}

	return (
		<div>
			<Button variant={todoList.filter === "all" ? "outlined" : "text"} onClick={() => changeFilterHandler('all')}
			        color={"inherit"}>
				All
			</Button>
			<Button
				variant={todoList.filter === "active" ? "outlined" : "text"}
				onClick={() => changeFilterHandler('active')}
				color={"primary"}
			>
				Active
			</Button>
			<Button
				variant={todoList.filter === "completed" ? "outlined" : "text"}
				onClick={() => changeFilterHandler('completed')}
				color={"secondary"}
			>
				Completed
			</Button>
		</div>
	);
}