import {todoListsActions} from "features/todoLists/model/todoListsSlice";
import {ITasksStateType, tasksSlice, tasksThunks} from "features/tasks/model/tasksSlice";
import {TaskPriorities, TaskStatuses} from "common/enums";

let startState: ITasksStateType = {};
const date = new Date();

beforeEach(() => {
	startState = {
		todoListId1: [
			{
				description: "",
				title: "CSS",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "1",
				todoListId: "todoListId1",
				order: 0,
				addedDate: date,
			},
			{
				description: "",
				title: "JS",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "2",
				todoListId: "todoListId1",
				order: 0,
				addedDate: date,
			},
			{
				description: "",
				title: "React",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "3",
				todoListId: "todoListId1",
				order: 0,
				addedDate: date,
			},
		],
		todoListId2: [
			{
				description: "",
				title: "bread",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "1",
				todoListId: "todoListId2",
				order: 0,
				addedDate: date,
			},
			{
				description: "",
				title: "milk",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "2",
				todoListId: "todoListId2",
				order: 0,
				addedDate: date,
			},
			{
				description: "",
				title: "tea",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "3",
				todoListId: "todoListId2",
				order: 0,
				addedDate: date,
			},
		],
	};
});

test("correct tasks should be deleted from correct array", () => {
	// const action = taskActions.removeTaskAC({ taskId: "2", todoListId: "todoListId2" });
	const action = tasksThunks.removeTask.fulfilled({taskId: "2", todoListId: "todoListId2"}, "requestId", {
		taskId: "2",
		todoListId: "todoListId2",
	});

	const endState = tasksSlice(startState, action);
	expect(endState).toEqual({
		todoListId1: [
			{
				description: "",
				title: "CSS",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "1",
				todoListId: "todoListId1",
				order: 0,
				addedDate: date,
			},
			{
				description: "",
				title: "JS",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "2",
				todoListId: "todoListId1",
				order: 0,
				addedDate: date,
			},
			{
				description: "",
				title: "React",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "3",
				todoListId: "todoListId1",
				order: 0,
				addedDate: date,
			},
		],
		todoListId2: [
			{
				description: "",
				title: "bread",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "1",
				todoListId: "todoListId2",
				order: 0,
				addedDate: date,
			},
			{
				description: "",
				title: "tea",
				status: TaskStatuses.InProgress,
				priority: TaskPriorities.Middle,
				startDate: date,
				deadline: date,
				id: "3",
				todoListId: "todoListId2",
				order: 0,
				addedDate: date,
			},
		],
	});
});

test("correct tasks should be added to correct array", () => {
	const newTask = {
		description: "",
		title: "juice",
		status: TaskStatuses.New,
		priority: TaskPriorities.Middle,
		startDate: date,
		deadline: date,
		id: "3",
		todoListId: "todoListId2",
		order: 0,
		addedDate: date,
	};
	// const action = taskActions.addTaskAC(newTask);
	const action = tasksThunks.addTask.fulfilled(newTask, "requestId", {
		todoListId: "todoListId2",
		title: "juice",
	});

	const endState = tasksSlice(startState, action);

	expect(endState["todoListId1"].length).toBe(3);
	expect(endState["todoListId2"].length).toBe(4);
	expect(endState["todoListId2"][0].id).toBeDefined();
	expect(endState["todoListId2"][0].title).toBe("juice");
	expect(endState["todoListId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified tasks should be changed", () => {
	const startData = {
		todoListId: "todoListId2",
		taskId: "2",
		taskModel: {
			status: TaskStatuses.Completed,
		},
	};
	const action = tasksThunks.updateTask.fulfilled(startData, "requestId", startData);
	// const action = tasksThunks.updateTask.fulfilled({
	//   todoListId: "todoListId2",
	//   taskId: "2",
	//   taskData: {
	//     status: TaskStatuses.Completed,
	//   },
	// });

	const endState = tasksSlice(startState, action);

	expect(endState["todoListId1"][0].status).toBe(TaskStatuses.InProgress);
	expect(endState["todoListId2"][1].status).toBe(TaskStatuses.Completed);
});

test("title of specified tasks should be changed", () => {
	const startData = {
		todoListId: "todoListId2",
		taskId: "2",
		taskModel: {title: "test"},
	};
	const action = tasksThunks.updateTask.fulfilled(startData, "requestId", startData);
	// const action = taskActions.updateTask({ todoListId: "todoListId2", taskId: "2", taskData: { title: "test" } });

	const endState = tasksSlice(startState, action);

	expect(endState["todoListId1"][0].title).toBe("CSS");
	expect(endState["todoListId2"][1].title).toBe("test");
});

test("property with todoListId1 should be deleted", () => {
	const action = todoListsActions.removeTodoListTC.fulfilled({todoListId: "todoListId2"}, 'id', {todoListId: "todoListId2"});

	const endState = tasksSlice(startState, action);

	const keys = Object.keys(endState);

	expect(keys.length).toBe(1);
	expect(endState["todoListId2"]).not.toBeDefined();
});
