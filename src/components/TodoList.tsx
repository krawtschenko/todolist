import React from 'react';
import {EFilter, ITasks} from "../App";
import styled from "styled-components";
import {InputButton} from "./InputButton";

const TodoListEl = styled.div`
  padding: 10px;
  border: 2px solid black;
  border-radius: 5px;
  background-color: darkgoldenrod;

  h2 {
    text-align: center;
  }

  ul {
    padding: 0;
  }

  li {
    list-style-type: none;
  }
`

const TodoList: React.FC<ITodoList> = ({title, tasks, removeTask, changeFilter, addTask}) => {
	const allTasks = tasks.map(el => {
		return (
			<li key={el.id}>
				<input type="checkbox" checked={el.isDone}/>
				{el.title}
				<button onClick={() => removeTask(el.id)}>X</button>
			</li>
		)
	})

	return (
		<TodoListEl>
			<h2>{title}</h2>
			<InputButton onClick={addTask}/>
			<ul>{allTasks}</ul>
			<div>
				<button onClick={() => changeFilter(EFilter.All)}>{EFilter.All}</button>
				<button onClick={() => changeFilter(EFilter.Active)}>{EFilter.Active}</button>
				<button onClick={() => changeFilter(EFilter.Completed)}>{EFilter.Completed}</button>
			</div>
		</TodoListEl>
	);
};

export default TodoList;

interface ITodoList {
	title: string
	tasks: ITasks[]
	removeTask: (taskId: string) => void
	changeFilter: (filter: EFilter) => void
	addTask: (title: string) => void
}