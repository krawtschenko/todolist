import React, {ChangeEvent, FC, useState} from 'react';

interface IEditableSpan {
	oldTitle: string
}

const EditableSpan: FC<IEditableSpan> = ({oldTitle}) => {
	const [edit, setEdit] = useState(false)
	const [newTitle, setNewTitle] = useState(oldTitle)

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNewTitle(e.currentTarget.value)
	}

	const editHandler = () => {
		setEdit(edit => !edit)
	}

	return (
		edit
			? <input value={newTitle} onBlur={editHandler} onChange={onChange} autoFocus/>
			: <span onDoubleClick={editHandler}>{newTitle}</span>
	);
};

export default EditableSpan;