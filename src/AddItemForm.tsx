import React, {ChangeEvent, FC, KeyboardEvent, useState} from 'react';

interface IAddItemForm {
	onClick: (newTitle: string) => void
}

const AddItemForm: FC<IAddItemForm> = ({onClick}) => {
	let [title, setTitle] = useState("")
	let [error, setError] = useState<string | null>(null)

	const addTask = () => {
		let newTitle = title.trim();
		if (newTitle !== "") {
			onClick(newTitle)
			setTitle("");
		} else {
			setError("Title is required");
		}
	}

	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.currentTarget.value)
	}

	const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		setError(null);
		if (e.charCode === 13) {
			addTask();
		}
	}

	return (
		<div>
			<input value={title}
			       onChange={onChangeHandler}
			       onKeyDown={onKeyPressHandler}
			       className={error ? "error" : ""}
			/>
			<button onClick={addTask}>+</button>
			{error && <div className="error-message">{error}</div>}
		</div>
	);
};

export default AddItemForm;