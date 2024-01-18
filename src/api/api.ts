import axios from "axios";

export interface IResponse<D = {}> {
	resultCode: number;
	messages: string[];
	fieldsErrors: string[];
	data: D;
}

export enum ResultCode {
	success,
	error,
	captcha = 10,
}

export interface ITodoList {
	id: string;
	addedDate: Date;
	order: number;
	title: string;
}

interface IGetTasks {
	error: string;
	totalCount: number;
	items: ITask[];
}

export interface ITask {
	id: string;
	title: string;
	description: string;
	todoListId: string;
	order: number;
	status: TaskStatuses;
	priority: TaskPriorities;
	startDate: Date;
	deadline: Date;
	addedDate: Date;
}

export enum TaskStatuses {
	New = 0,
	InProgress = 1,
	Completed = 3,
	Draft = 4,
}

export enum TaskPriorities {
	Low = 0,
	Middle = 1,
	Hight = 3,
	Urgently = 4,
	Later = 5,
}

export interface IUpdateModelTask {
	title: string;
	description: string;
	status: TaskStatuses;
	priority: TaskPriorities;
	startDate: Date;
	deadline: Date;
}

export interface ILoginParams {
	email: string;
	password: string;
	rememberMe?: boolean;
}

const instance = axios.create({
	baseURL: "https://social-network.samuraijs.com/api/1.1/",
	withCredentials: true,
});

export const todoListAPI = {
	getTodoLists() {
		return instance.get<ITodoList[]>(`todo-lists`);
	},
	createTodoList(title: string) {
		return instance.post<IResponse<{ item: ITodoList }>>(`todo-lists`, {
			title,
		});
	},
	updateTodoList(arg: { todoListId: string, title: string }) {
		return instance.put<IResponse>(`todo-lists/${arg.todoListId}`, {
			title: arg.title,
		});
	},
	deleteTodoList(todoListId: string) {
		return instance.delete<IResponse>(`todo-lists/${todoListId}`);
	},
};

export const taskAPI = {
	getTasks: (todoListId: string) => {
		return instance.get<IGetTasks>(`todo-lists/${todoListId}/tasks`);
	},
	createTask: (arg: { todoListId: string; title: string }) => {
		return instance.post<IResponse<{ item: ITask }>>(`todo-lists/${arg.todoListId}/tasks`, {
			title: arg.title,
		});
	},
	updateTask: (todoListId: string, taskId: string, taskData: IUpdateModelTask) => {
		return instance.put(`todo-lists/${todoListId}/tasks/${taskId}`, taskData);
	},
	deleteTask: (arg: { todoListId: string, taskId: string }) => {
		return instance.delete<IResponse>(`todo-lists/${arg.todoListId}/tasks/${arg.taskId}`);
	},
};

export const authAPI = {
	login: (data: ILoginParams) => {
		return instance.post<IResponse<{ userId: number }>>("auth/login", data);
	},
	logout: () => {
		return instance.delete<IResponse>("auth/login");
	},
	me: () => {
		return instance.get<IResponse<{ id: number; email: string; login: string }>>("auth/me");
	},
};
