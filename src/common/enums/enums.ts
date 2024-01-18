export enum ResultCode {
	success,
	error,
	captcha = 10,
}

export enum TaskStatuses {
	New = 0,
	InProgress = 1,
	Completed = 3,
	Draft = 4,
}

export enum TaskPriorities {
	Low = 0,
	Middle = 1,
	Hight = 3,
	Urgently = 4,
	Later = 5,
}