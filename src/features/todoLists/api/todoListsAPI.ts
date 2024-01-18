import {instance} from "common/instance";
import {IResponse, ITodoList} from "common/interfaces";

export const todoListsAPI = {
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