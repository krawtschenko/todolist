import {ChangeEvent, KeyboardEvent, memo, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {AddBox} from "@mui/icons-material";
import {ITodoList} from "common/interfaces";

type Props = {
	addItem: (title: string) => Promise<ITodoList>;
	disabled?: boolean;
};

export const AddItemForm = memo((props: Props) => {
	let [title, setTitle] = useState("");
	let [error, setError] = useState<string | null>(null);

	const addItemHandler = () => {
		if (title.trim() !== "") {
			props.addItem(title).then(() => {
				setTitle("")
			}).catch(() => {
				setError('Error X')
			})
		} else {
			setError("Title is required");
		}
	};

	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.currentTarget.value);
	};

	const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		if (error) setError(null);
		if (e.key === "Enter") {
			addItemHandler();
		}
	};

	return (
		<div>
			<TextField
				variant="outlined"
				error={!!error}
				value={title}
				onChange={onChangeHandler}
				onKeyDown={onKeyPressHandler}
				label="Title"
				helperText={error}
			/>
			<IconButton color="primary" onClick={addItemHandler} disabled={props.disabled}>
				<AddBox/>
			</IconButton>
		</div>
	);
});
