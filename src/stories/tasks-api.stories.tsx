import { useEffect, useState } from "react";
import { taskAPI } from "../api/api";

export default {
  title: "Task_API",
};

export const GetTasks = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      const todoListId = "c6626cb8-6088-4458-85bc-ca92fe9b8005";
      const response = await taskAPI.getTasks(todoListId);
      const titles = response.data.items.map(
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

export const CreateTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      const todoListId = "c6626cb8-6088-4458-85bc-ca92fe9b8005";
      const title = "Arider";
      const response = await taskAPI.createTask(todoListId, title);
      setState(response.data);
    }
    fetchData();
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todoListId = "c6626cb8-6088-4458-85bc-ca92fe9b8005";
    const taskId = "2dbc4f9a-1a94-455b-999c-88f171b5a46c";
    async function fetchData() {
      const response = await taskAPI.deleteTask(todoListId, taskId);
      setState(response.data);
    }
    fetchData();
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};

export const UpdateTaskTitle = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    const todoListId = "c6626cb8-6088-4458-85bc-ca92fe9b8005";
    const taskId = "b04cc91c-d5ad-499f-8b59-5b188243d3ae";
    const taskData = {
      title: "Rexxar",
    };
    async function fetchData() {
      const response = await taskAPI.updateTask(todoListId, taskId, taskData);
      setState(response.data);
    }
    fetchData();
  }, []);

  return <div>{JSON.stringify(state)}</div>;
};
