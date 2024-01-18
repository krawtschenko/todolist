import {instance} from "common/instance";
import {IGetTasks, IResponse, ITask, IUpdateModelTask} from "common/interfaces";

export const tasksAPI = {
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