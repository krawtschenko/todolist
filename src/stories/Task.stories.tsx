import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Task } from "../components/task/Task";
import { TaskPriorities, TaskStatuses } from "../api/api";

// More on how to set up stories at:
// https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Task> = {
  title: "TODOLIST/Task",
  component: Task,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  args: {
    changeTaskStatus: action("Status changed inside Task"),
    changeTaskTitle: action("Title changed inside Task"),
    removeTask: action("Remove Button clicked changed inside Task"),
    task: {
      description: "",
      title: "JS",
      completed: false,
      status: TaskStatuses.InProgress,
      priority: TaskPriorities.Middle,
      startDate: new Date(),
      deadline: new Date(),
      id: "12i2343",
      todoListId: "123",
      order: 0,
      addedDate: new Date(),
    },
  },
};

export default meta;
type Story = StoryObj<typeof Task>;

// More on component templates:
// https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const TaskIsNotDoneStory: Story = {};

export const TaskIsDoneStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    task: {
      description: "",
      title: "JS",
      completed: true,
      status: TaskStatuses.InProgress,
      priority: TaskPriorities.Middle,
      startDate: new Date(),
      deadline: new Date(),
      id: "12i2343",
      todoListId: "123",
      order: 0,
      addedDate: new Date(),
    },
  },
};
