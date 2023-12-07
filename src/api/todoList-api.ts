import axios from "axios";

interface ITodoList {
  id: string;
  addedDate: string;
  order: number;
  title: string;
}

export interface IResponse<D> {
  resultCode: number;
  messages: string[];
  fieldsErrors: string[];
  data: D;
}

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "32d7180f-21f4-47ca-912d-cbdd2de48bc5",
  },
});

export const todoListAPI = {
  getTodoLists() {
    const promise = instance.get<ITodoList[]>(`todo-lists`);
    return promise;
  },
  createTodoList(title: string) {
    const promise = instance.post<IResponse<{ item: ITodoList }>>(
      `todo-lists`,
      {
        title: title,
      }
    );
    return promise;
  },
  updateTodoList(todoListId: string, title: string) {
    const promise = instance.put<IResponse<{}>>(`todo-lists/${todoListId}`, {
      title: title,
    });
    return promise;
  },
  deleteTodoList(todoListId: string) {
    const promise = instance.delete<IResponse<{}>>(`todo-lists/${todoListId}`);
    return promise;
  },
};
