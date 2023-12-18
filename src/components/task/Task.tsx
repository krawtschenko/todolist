import { FC, memo } from "react";
import Checkbox from "@mui/material/Checkbox";
import { EditableSpan } from "../superSpan/EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import { Delete } from "@mui/icons-material";
import { ITask, TaskStatuses } from "../../api/api";

interface ITaskProps {
  task: ITask;
  removeTask: (taskId: string) => void;
  changeTaskStatus: (id: string, status: TaskStatuses) => void;
  changeTaskTitle: (taskId: string, title: string) => void;
}

export const Task: FC<ITaskProps> = memo(({ task, ...props }) => {
  return (
    <div className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        color="primary"
        onChange={(e) =>
          props.changeTaskStatus(
            task.id,
            e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.InProgress
          )
        }
      />
      <EditableSpan
        value={task.title}
        onChange={(newValue) => props.changeTaskTitle(task.id, newValue)}
      />
      <IconButton onClick={() => props.removeTask(task.id)}>
        <Delete />
      </IconButton>
    </div>
  );
});
