import React, { ChangeEvent, useCallback } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import { Delete } from "@mui/icons-material";
import { TaskStatusesObj, TaskType } from "common/api/tasks-api";
import { useTasks } from "features/todolists-list/tasks/useTasks";

type TaskProps = {
  task: TaskType;
  todolistId: string;
};
export const Task = React.memo((props: TaskProps) => {
  const { removeTask, changeStatus, changeTaskTitle } = useTasks();

  const onClickHandler = useCallback(
    () => removeTask(props.task.id, props.todolistId),
    [props.task.id, props.todolistId]
  );

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      changeStatus(props.task.id, newIsDoneValue ? TaskStatusesObj.Completed : TaskStatusesObj.New, props.todolistId);
    },
    [props.task.id, props.todolistId]
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      changeTaskTitle(props.task.id, newValue, props.todolistId);
    },
    [props.task.id, props.todolistId]
  );

  return (
    <div key={props.task.id} className={props.task.status === TaskStatusesObj.Completed ? "is-done" : ""}>
      <Checkbox checked={props.task.status === TaskStatusesObj.Completed} color="primary" onChange={onChangeHandler} />
      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={onClickHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});
