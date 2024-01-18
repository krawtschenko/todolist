import {TaskPriorities, TaskStatuses} from "common/enums";

export interface IResponse<D = {}> {
	resultCode: number;
	messages: string[];
	fieldsErrors: string[];
	data: D;
}

export interface ITodoList {
	id: string;
	addedDate: Date;
	order: number;
	title: string;
}

export interface IGetTasks {
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