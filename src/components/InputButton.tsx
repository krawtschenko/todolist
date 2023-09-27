import React, {ChangeEvent, useState} from 'react';
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: 230px auto;
  column-gap: 5px;
`
const Button = styled.button`
  background-color: blueviolet;
  border: 1px solid black;
  border-radius: 3px;
  cursor: pointer;

  &:disabled {
    background-color: red;
	  cursor: default;
  }
`

export const InputButton: React.FC<IInputButton> = ({onClick}) => {
	const [input, setInput] = useState<string>('')

	function changeInput(text: ChangeEvent<HTMLInputElement>) {
		setInput(text.currentTarget.value)
	}

	function addTask() {
		onClick(input)
		setInput('')
	}

	return (
		<Container>
			<input value={input} onChange={(event) => changeInput(event)}/>
			<Button onClick={addTask} disabled={!input.trim()}>+</Button>
		</Container>
	);
};

interface IInputButton {
	onClick: (title: string) => void
}