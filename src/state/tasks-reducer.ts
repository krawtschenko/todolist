import {TasksStateType} from "../components/app/App";
import {v1} from "uuid";
import {AddTodolistType, RemoveTodolistType} from "./todo-lists-reducer";

export const tasksReducer = (state: TasksStateType, action: ActionTypes) => {
	switch (action.type) {
		case 'REMOVE-TASK':
			return {
				...state,
				[action.payload.todoListId]: state[action.payload.todoListId].filter(elem => elem.id !== action.payload.taskId)
			}
		case 'ADD-TASK':
			const task = {id: v1(), title: action.payload.title, isDone: false}
			return {
				...state,
				[action.payload.todoListId]: [task, ...state[action.payload.todoListId]]
			}
		case 'CHANGE-TASK-STATUS':
			return {
				...state,
				[action.payload.todoListId]: state[action.payload.todoListId]
					.map(elem => elem.id === action.payload.taskId ? {...elem, isDone: action.payload.isDone} : elem)
			}
		case 'CHANGE-TASK-TITLE':
			return {
				...state,
				[action.payload.todoListId]: state[action.payload.todoListId]
					.map(elem => elem.id === action.payload.taskId ? {...elem, title: action.payload.title} : elem)
			}
		case 'ADD-TODOLIST':
			return {
				...state,
				[action.payload.todoListId]: []
			}
		case 'REMOVE-TODOLIST':
			const newState = Object.assign(state)
			delete newState[action.payload.id]
			return newState
		default:
			throw new Error("I don't understand this type")
	}
}

type ActionTypes = RemoveTaskType
	| AddTaskType
	| ChangeTaskStatusType
	| ChangeTaskTitleType
	| AddTodolistType
	| RemoveTodolistType
type RemoveTaskType = ReturnType<typeof removeTaskAC>
type AddTaskType = ReturnType<typeof addTaskAC>
type ChangeTaskStatusType = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleType = ReturnType<typeof changeTaskTitleAC>

export const removeTaskAC = (taskId: string, todoListId: string) => {
	return {
		type: 'REMOVE-TASK' as const,
		payload: {
			taskId,
			todoListId
		}
	}
}

export const addTaskAC = (todoListId: string, title: string) => {
	return {
		type: 'ADD-TASK' as const,
		payload: {
			todoListId,
			title
		}
	}
}

export const changeTaskStatusAC = (taskId: string, todoListId: string, isDone: boolean) => {
	return {
		type: 'CHANGE-TASK-STATUS' as const,
		payload: {
			taskId,
			todoListId,
			isDone
		}
	}
}

export const changeTaskTitleAC = (taskId: string, todoListId: string, title: string) => {
	return {
		type: 'CHANGE-TASK-TITLE' as const,
		payload: {
			taskId,
			todoListId,
			title
		}
	}
}