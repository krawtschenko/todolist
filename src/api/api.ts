import axios from "axios";

interface ITodoList {
  id: string;
  addedDate: Date;
  order: number;
  title: string;
}

interface IResponse<D = {}> {
  resultCode: number;
  messages: string[];
  fieldsErrors: string[];
  data: D;
}

interface IGetTasks {
  error: string;
  totalCount: number;
  items: ITask[];
}

interface ITask {
  description: string;
  title: string;
  completed: boolean;
  status: number;
  priority: number;
  startDate: Date;
  deadline: Date;
  id: string;
  todoListId: string;
  order: number;
  addedDate: Date;
}

interface IUpdateModelTask {
  title: string;
  description: string;
  completed: boolean;
  status: number;
  priority: number;
  startDate: Date;
  deadline: Date;
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
  updateTodoList(todoListId: string, title: string) {
    return instance.put<IResponse>(`todo-lists/${todoListId}`, {
      title: title,
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
  createTask: (todoListId: string, title: string) => {
    return instance.post<IResponse<ITask>>(`todo-lists/${todoListId}/tasks`, {
      title,
    });
  },
  updateTask: (
    todoListId: string,
    taskId: string,
    taskData: IUpdateModelTask
  ) => {
    return instance.put(`todo-lists/${todoListId}/tasks/${taskId}`, taskData);
  },
  deleteTask: (todoListId: string, taskId: string) => {
    return instance.delete<IResponse>(
      `todo-lists/${todoListId}/tasks/${taskId}`
    );
  },
};
