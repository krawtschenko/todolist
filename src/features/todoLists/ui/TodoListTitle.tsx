import React from 'react';
import {EditableSpan} from "common/components/editableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {ITodoListDomain, todoListsActions} from "features/todoLists/model/todoListsSlice";
import {useAppDispatch} from "common/hooks/useAppDispatch";

interface Props {
	todoList: ITodoListDomain
}

export const TodoListTitle = ({todoList}: Props) => {
	const dispatch = useAppDispatch();

	const removeTodoList = () => {
		dispatch(todoListsActions.removeTodoListTC({todoListId: todoList.id}));
	}

	const changeTodoListTitle = (title: string) => {
		dispatch(todoListsActions.changeTodoListTitleTC({todoListId: todoList.id, title}));
	}

	return (
		<h3>
			<EditableSpan value={todoList.title} onChange={changeTodoListTitle}/>
			<IconButton onClick={removeTodoList} disabled={todoList.entityStatus === "loading"}>
				<Delete/>
			</IconButton>
		</h3>
	);
}