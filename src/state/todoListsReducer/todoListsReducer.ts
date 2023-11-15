import {FilterType, TodoListType} from "../../components/app/App";
import {v1} from "uuid";

const initialState: TodoListType[] = [
	{id: '12345', title: 'Test', filter: 'all'}
]

export const todoListsReducer = (state = initialState, action: ActionTypes) => {
	switch (action.type) {
		case 'REMOVE-TODOLIST':
			return state.filter(item => item.id !== action.payload.id)
		case 'ADD-TODOLIST':
			return [{id: action.payload.todoListId, title: action.payload.title, filter: 'all'}, ...state]
		case 'CHANGE-TODOLIST-TITLE':
			return state.map(item => item.id === action.payload.id ? {...item, title: action.payload.title} : item)
		case 'CHANGE-TODOLIST-FILTER':
			return state.map(item => item.id === action.payload.id ? {...item, filter: action.payload.filter} : item)
		default:
			return state
	}
}

type ActionTypes = RemoveTodolistType | AddTodolistType | changeTodoListTitleType | changeTodoListFilterType

export type RemoveTodolistType = ReturnType<typeof removeTodoListAC>
export type AddTodolistType = ReturnType<typeof addTodoListAC>
type changeTodoListTitleType = ReturnType<typeof changeTodoListTitleAC>
type changeTodoListFilterType = ReturnType<typeof changeTodoListFilterAC>

export const removeTodoListAC = (id: string) => {
	return {
		type: 'REMOVE-TODOLIST' as const,
		payload: {
			id
		}
	}
}

export const addTodoListAC = (title: string) => {
	return {
		type: 'ADD-TODOLIST' as const,
		payload: {
			title,
			todoListId: v1()
		}
	}
}

export const changeTodoListTitleAC = (id: string, title: string) => {
	return {
		type: 'CHANGE-TODOLIST-TITLE' as const,
		payload: {
			id,
			title
		}
	}
}

export const changeTodoListFilterAC = (id: string, filter: FilterType) => {
	return {
		type: 'CHANGE-TODOLIST-FILTER' as const,
		payload: {
			id,
			filter
		}
	}
}
