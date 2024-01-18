import type {Meta, StoryObj} from '@storybook/react';
import {AddItemForm} from '../common/components/addItemForm/AddItemForm';
import {action} from '@storybook/addon-actions'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof AddItemForm> = {
	title: 'TODOLIST/AddItemForm',
	component: AddItemForm,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: 'centered',
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		addItem: {
			description: 'Button clicked inside form',
			action: 'clicked'
		}
	},
};

export default meta;
type Story = StoryObj<typeof AddItemForm>;

export const AddItemFormStory: Story = {
	// More on args: https://storybook.js.org/docs/react/writing-stories/args
	args: {
		addItem: action('Button clicked inside form')
	},
};