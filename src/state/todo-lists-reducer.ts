import {FilterType, TodoListType} from "../components/app/App";
import {v1} from "uuid";

export const todoListsReducer = (state: TodoListType[], action: TodoListAT): TodoListType[] => {
	switch (action.type) {
		case 'REMOVE-TODOLIST':
			return state.filter(item => item.id !== action.payload.id)
		case 'ADD-TODOLIST':
			return [{id: v1(), title: action.payload.title, filter: 'all'}, ...state]
		case 'CHANGE-TODOLIST-TITLE':
			return state.map(item => item.id === action.payload.id ? {...item, title: action.payload.title} : item)
		case 'CHANGE-TODOLIST-FILTER':
			return state.map(item => item.id === action.payload.id ? {...item, filter: action.payload.filter} : item)
		default:
			throw new Error("I don't understand this type")
	}
}

type TodoListAT = RemoveTodolistAT | AddTodolistAT | changeTodoListTitleAT | changeTodoListFilterAT

type RemoveTodolistAT = ReturnType<typeof removeTodolist>
type AddTodolistAT = ReturnType<typeof addTodolist>
type changeTodoListTitleAT = ReturnType<typeof changeTodoListTitle>
type changeTodoListFilterAT = ReturnType<typeof changeTodoListFilter>

export const removeTodolist = (id: string) => {
	return {
		type: 'REMOVE-TODOLIST' as const,
		payload: {
			id
		}
	}
}

export const addTodolist = (title: string) => {
	return {
		type: 'ADD-TODOLIST' as const,
		payload: {
			title
		}
	}
}

export const changeTodoListTitle = (id: string, title: string) => {
	return {
		type: 'CHANGE-TODOLIST-TITLE' as const,
		payload: {
			id,
			title
		}
	}
}

export const changeTodoListFilter = (id: string, filter: FilterType) => {
	return {
		type: 'CHANGE-TODOLIST-FILTER' as const,
		payload: {
			id,
			filter
		}
	}
}
