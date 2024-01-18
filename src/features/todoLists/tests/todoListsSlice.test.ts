import {ITodoListDomain, todoListsActions, todoListsSlice} from "features/todoLists/model/todoListsSlice";
import {v1} from "uuid";

let todoListId1 = v1();
let todoListId2 = v1();
let todoListId3 = v1();
let newTodoListTitle = "New Test";
const date = new Date();
const newTodoList = {id: todoListId3, addedDate: date, order: 1, title: newTodoListTitle};
let startState: ITodoListDomain[] = [
	{
		id: todoListId1,
		title: "What to learn",
		filter: "all",
		addedDate: date,
		order: 1,
		entityStatus: "idle",
	},
	{
		id: todoListId2,
		title: "What to buy",
		filter: "all",
		addedDate: date,
		order: 1,
		entityStatus: "idle",
	},
];

beforeEach(() => {
	todoListId1 = v1();
	todoListId2 = v1();
	newTodoListTitle = "New Test";
	startState = [
		{
			id: todoListId1,
			title: "What to learn",
			filter: "all",
			addedDate: date,
			order: 1,
			entityStatus: "idle",
		},
		{
			id: todoListId2,
			title: "What to buy",
			filter: "all",
			addedDate: date,
			order: 1,
			entityStatus: "idle",
		},
	];
});

test("correct todoLists should be removed", () => {
	const action = todoListsActions.removeTodoListTC.fulfilled(
		{todoListId: todoListId1}, 'id', {todoListId: todoListId1}
	);
	const endState = todoListsSlice(startState, action);

	expect(endState.length).toBe(1);
	expect(endState[0].id).toBe(todoListId2);
});

test("correct todoLists should be added", () => {
	const action = todoListsActions.createTodoListTC.fulfilled(newTodoList, "requestId", {title: newTodoListTitle});
	const endState = todoListsSlice(startState, action);

	expect(endState.length).toBe(3);
	expect(endState[0].title).toBe(newTodoListTitle);
});

test("correct todoLists should change its name", () => {
	const endState = todoListsSlice(
		startState,
		todoListsActions.changeTodoListTitleTC.fulfilled({
			todoListId: todoListId2,
			title: newTodoListTitle
		}, 'id', {todoListId: todoListId2, title: newTodoListTitle})
	);

	expect(endState[0].title).toBe("What to learn");
	expect(endState[1].title).toBe(newTodoListTitle);
});

test("correct filter of todoLists should be changed", () => {
	const endState = todoListsSlice(
		startState,
		todoListsActions.changeTodoListFilterAC({todoListId: todoListId2, filter: "completed"})
	);

	expect(endState[0].filter).toBe("all");
	expect(endState[1].filter).toBe("completed");
});
