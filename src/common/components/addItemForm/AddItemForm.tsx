import {ChangeEvent, KeyboardEvent, memo, useState} from "react";
import {IconButton, TextField} from "@mui/material";
import {AddBox} from "@mui/icons-material";
import {IResponse} from "common/interfaces";

type Props = {
	addItem: (title: string) => Promise<any>;
	disabled?: boolean;
};

export const AddItemForm = memo((props: Props) => {
	let [title, setTitle] = useState("");
	let [error, setError] = useState<string | null>(null);

	const addItemHandler = () => {
		if (title.trim() !== "") {
			props.addItem(title).then(() => {
				setTitle("")
			}).catch((error: IResponse) => {
				if (error.resultCode) {
					setError(error.messages[0])
				}
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
