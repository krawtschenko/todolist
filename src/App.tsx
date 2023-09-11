import React from 'react';
import './App.css';
import {TodoList} from "./components/TodoList";

export const App = () => {
    const todoListTitle1: string = "What to do"
    const todoListTitle2: string = "What to buy"

    const task_1: Array<taskType> = [
        {id: 1, isDone: true, title: "HTML&CSS"},
        {id: 2, isDone: true, title: "JavaScript"},
        {id: 3, isDone: false, title: "React"}
    ]

    const task_2: Array<taskType> = [
        {id: 4, isDone: true, title: "Iphone"},
        {id: 5, isDone: true, title: "Ipod"},
        {id: 6, isDone: false, title: "Ipad"}
    ]

    return (
        <div className="App">
            <TodoList tasks={task_1} title={todoListTitle1}/>
            <TodoList tasks={task_2} title={todoListTitle2}/>
        </div>
    );
}

export type taskType = {
    id: number
    title: string
    isDone: boolean
}