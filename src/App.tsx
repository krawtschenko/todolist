import React, {useState} from 'react';
import './App.css';
import {AddItemForm} from './AddItemForm';
import AppBar from '@mui/material/AppBar/AppBar';
import {Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TaskType, TodoList} from "./Todolist";


export type FilterValuesType = "all" | "active" | "completed";
export type todoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

type TasksStateType = {
    [key: string]: Array<TaskType>
}


function App() {
    let todoListId1 = crypto.randomUUID();
    let todoListId2 = crypto.randomUUID();

    let [todoLists, setTodoLists] = useState<Array<todoListType>>([
        {id: todoListId1, title: "What to learn", filter: "all"},
        {id: todoListId2, title: "What to buy", filter: "all"}
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todoListId1]: [
            {id: crypto.randomUUID(), title: "HTML&CSS", isDone: true},
            {id: crypto.randomUUID(), title: "JS", isDone: true}
        ],
        [todoListId2]: [
            {id: crypto.randomUUID(), title: "Milk", isDone: true},
            {id: crypto.randomUUID(), title: "React Book", isDone: true}
        ]
    });


    function removeTask(id: string, todoListId: string) {
        //достанем нужный массив по todoListId:
        let todoListTasks = tasks[todoListId];
        // перезапишем в этом объекте массив для нужного тудулиста отфилтрованным массивом:
        tasks[todoListId] = todoListTasks.filter(t => t.id != id);
        // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        setTasks({...tasks});
    }

    function addTask(title: string, todoListId: string) {
        let task = {id: crypto.randomUUID(), title: title, isDone: false};
        //достанем нужный массив по todoListId:
        let todoListTasks = tasks[todoListId];
        // перезапишем в этом объекте массив для нужного тудулиста кRопией, добавив в начало новую таску:
        tasks[todoListId] = [task, ...todoListTasks];
        // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        setTasks({...tasks});
    }

    function changeStatus(id: string, isDone: boolean, todoListId: string) {
        //достанем нужный массив по todoListId:
        let todoListTasks = tasks[todoListId];
        // найдём нужную таску:
        let task = todoListTasks.find(t => t.id === id);
        //изменим таску, если она нашлась
        if (task) {
            task.isDone = isDone;
            // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
            setTasks({...tasks});
        }
    }

    function changeTaskTitle(id: string, newTitle: string, todoListId: string) {
        //достанем нужный массив по todoListId:
        let todoListTasks = tasks[todoListId];
        // найдём нужную таску:
        let task = todoListTasks.find(t => t.id === id);
        //изменим таску, если она нашлась
        if (task) {
            task.title = newTitle;
            // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
            setTasks({...tasks});
        }
    }

    function changeFilter(value: FilterValuesType, todoListId: string) {
        let todoList = todoLists.find(tl => tl.id === todoListId);
        if (todoList) {
            todoList.filter = value;
            setTodoLists([...todoLists])
        }
    }

    function removetodoList(id: string) {
        // засунем в стейт список тудулистов, id которых не равны тому, который нужно выкинуть
        setTodoLists(todoLists.filter(tl => tl.id != id));
        // удалим таски для этого тудулиста из второго стейта, где мы храним отдельно таски
        delete tasks[id]; // удаляем св-во из объекта... значением которого являлся массив тасок
        // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        setTasks({...tasks});
    }

    function changetodoListTitle(id: string, title: string) {
        // найдём нужный todoList
        const todoList = todoLists.find(tl => tl.id === id);
        if (todoList) {
            // если нашёлся - изменим ему заголовок
            todoList.title = title;
            setTodoLists([...todoLists]);
        }
    }

    function addtodoList(title: string) {
        let newtodoListId = crypto.randomUUID();
        let newtodoList: todoListType = {id: newtodoListId, title: title, filter: 'all'};
        setTodoLists([newtodoList, ...todoLists]);
        setTasks({
            ...tasks,
            [newtodoListId]: []
        })
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu />
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addtodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoLists.map(tl => {
                            let alltodoListTasks = tasks[tl.id];
                            let tasksFortodoList = alltodoListTasks;

                            if (tl.filter === "active") {
                                tasksFortodoList = alltodoListTasks.filter(t => !t.isDone);
                            }
                            if (tl.filter === "completed") {
                                tasksFortodoList = alltodoListTasks.filter(t => t.isDone);
                            }

                            return <Grid key={tl.id} item>
                                <Paper style={{padding: "10px"}}>
                                    <TodoList
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksFortodoList}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodoList={removetodoList}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodoListTitle={changetodoListTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
