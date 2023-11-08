import {TodoListType} from '../components/app/App';
import {
	addTodoList,
	changeTodoListFilter,
	changeTodoListTitle,
	removeTodoList,
	todoListsReducer
} from "./todo-lists-reducer";
import {v1} from "uuid";

const todolistId1 = v1();
const todolistId2 = v1();
const newTodolistTitle = 'New Test'

test('correct todolist should be removed', () => {
	const startState: Array<TodoListType> = [
		{id: todolistId1, title: "What to learn", filter: "all"},
		{id: todolistId2, title: "What to buy", filter: "all"}
	]

	const endState = todoListsReducer(startState, removeTodoList(todolistId1))

	expect(endState.length).toBe(1);
	expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
	const startState: Array<TodoListType> = [
		{id: todolistId1, title: 'What to learn', filter: 'all'},
		{id: todolistId2, title: 'What to buy', filter: 'all'}
	]

	const endState = todoListsReducer(startState, addTodoList(newTodolistTitle))

	expect(endState.length).toBe(3)
	expect(endState[0].title).toBe(newTodolistTitle)
})

test('correct todolist should change its name', () => {
	const startState: Array<TodoListType> = [
		{id: todolistId1, title: 'What to learn', filter: 'all'},
		{id: todolistId2, title: 'What to buy', filter: 'all'}
	]

	const endState = todoListsReducer(startState, changeTodoListTitle(todolistId2, newTodolistTitle))

	expect(endState[0].title).toBe('What to learn')
	expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {

	const startState: Array<TodoListType> = [
		{id: todolistId1, title: 'What to learn', filter: 'all'},
		{id: todolistId2, title: 'What to buy', filter: 'all'}
	]

	const endState = todoListsReducer(startState, changeTodoListFilter(todolistId2, 'completed'))

	expect(endState[0].filter).toBe('all')
	expect(endState[1].filter).toBe('completed')
})

