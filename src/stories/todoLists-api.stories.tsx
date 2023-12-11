import { useEffect, useState } from "react";
import { todoListAPI } from "../api/api";

export default {
  title: "TodoList_API",
};

export const GetTodoLists = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      const response = await todoListAPI.getTodoLists();
      const titles = response.data.map(
        (elem: any) => elem.title + " - " + elem.id
      );
      setState(titles);
    }
    fetchData();
  }, []);

  return (
    <>
      {state?.map((elem: any, index: number) => (
        <div key={index}>
          {index + 1}. {elem}
        </div>
      ))}
    </>
  );
};

export const CreateTodoList = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      const response = await todoListAPI.createTodoList("Hello World");
      setState(response.data);
    }
    fetchData();
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const DeleteTodoList = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todoListId = "5b245bde-4340-4fa4-be65-7734ea8874b1";
    async function fetchData() {
      const response = await todoListAPI.deleteTodoList(todoListId);
      setState(response.data);
    }
    fetchData();
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const UpdateTodoListTitle = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todoListId = "90bc4aae-7ff0-46ab-853a-ab9000fdc888";
    async function fetchData() {
      const response = await todoListAPI.updateTodoList(todoListId, "Thrall");
      setState(response.data);
    }
    fetchData();
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
