import React, {ChangeEvent, memo, useCallback} from 'react';
import {AddItemForm} from '../superForm/AddItemForm';
import {EditableSpan} from '../superSpan/EditableSpan';
import IconButton from '@mui/material/IconButton/IconButton';
import {Delete} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import {FilterType, TaskType} from "../app/App";

type PropsType = {
	id: string
	title: string
	tasks: Array<TaskType>
	removeTask: (taskId: string, todolistId: string) => void
	changeFilter: (value: FilterType, todolistId: string) => void
	addTask: (title: string, todolistId: string) => void
	changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
	removeTodoList: (id: string) => void
	changeTodoListTitle: (id: string, newTitle: string) => void
	filter: FilterType
	changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const TodoList = memo((props: PropsType) => {
		const addTask = useCallback((title: string) => {
			props.addTask(title, props.id);
		}, [props.id, props.addTask])

		const removeTodolist = () => {
			props.removeTodoList(props.id);
		}
		const changeTodolistTitle = useCallback((title: string) => {
			props.changeTodoListTitle(props.id, title);
		}, [props.changeTodoListTitle, props.id])

		const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id),
			[props.changeFilter, props.id]);
		const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id),
			[props.changeFilter, props.id]);
		const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id),
			[props.changeFilter, props.id]);

		let todoListTasks = props.tasks;

		if (props.filter === "active") {
			todoListTasks = todoListTasks.filter(t => !t.isDone);
		}
		if (props.filter === "completed") {
			todoListTasks = todoListTasks.filter(t => t.isDone);
		}

		return <div>
			<h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
				<IconButton onClick={removeTodolist}>
					<Delete/>
				</IconButton>
			</h3>
			<AddItemForm addItem={addTask}/>
			<div>
				{
					todoListTasks.map(t => {
						const onClickHandler = () => props.removeTask(t.id, props.id)
						const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
							let newIsDoneValue = e.currentTarget.checked;
							props.changeTaskStatus(t.id, newIsDoneValue, props.id);
						}
						const onTitleChangeHandler = (newValue: string) => {
							props.changeTaskTitle(t.id, newValue, props.id);
						}


						return <div key={t.id} className={t.isDone ? "is-done" : ""}>
							<Checkbox
								checked={t.isDone}
								color="primary"
								onChange={onChangeHandler}
							/>

							<EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
							<IconButton onClick={onClickHandler}>
								<Delete/>
							</IconButton>
						</div>
					})
				}
			</div>
			<div>
				<Button variant={props.filter === 'all' ? 'outlined' : 'text'}
				        onClick={onAllClickHandler}
				        color={'inherit'}
				>All
				</Button>
				<Button variant={props.filter === 'active' ? 'outlined' : 'text'}
				        onClick={onActiveClickHandler}
				        color={'primary'}>Active
				</Button>
				<Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
				        onClick={onCompletedClickHandler}
				        color={'secondary'}>Completed
				</Button>
			</div>
		</div>
	}
)

