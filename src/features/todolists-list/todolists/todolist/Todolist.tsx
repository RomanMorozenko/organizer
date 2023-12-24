import React, { useCallback, useEffect } from "react";
import { AddItemForm } from "../../../../components/AddItemForm/AddItemForm";
import { EditableSpan } from "../../../../components/EditableSpan/EditableSpan";
import { Task } from "./task/Task";
import { TaskStatusesObj } from "../../../../common/api/tasks-api";
import { FilterValuesType, TodolistDomainType } from "features/todolists-list/todolists/todolists.reducer";
import { tasksThunks } from "features/todolists-list/tasks/tasks.reducer";
import { useAppDispatch } from "../../../../common/hooks/useAppDispatch";
import { Button, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useTasks } from "../../tasks/useTasks";
import { useTodoLists } from "../../todolists/useTodoLists";
import { useSelector } from "react-redux";
import { tasksSelectors } from "features/todolists-list/tasks";

type Props = {
  todolist: TodolistDomainType;
};

export const Todolist = React.memo(function ({ todolist }: Props) {
  const { addTask } = useTasks();
  const { changeFilter, removeTodolist, changeTodolistTitle } = useTodoLists();
  const dispatch = useAppDispatch();
  const tasks = useSelector(tasksSelectors.selectTasksForTodolist(todolist.id));

  useEffect(() => {
    const thunk = tasksThunks.fetchTasksTC({ todolistId: todolist.id });
    dispatch(thunk);
  }, []);

  const removeTodolistHandler = () => {
    removeTodolist(todolist.id);
  };

  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle(todolist.id, title);
    },
    [todolist.id, changeTodolistTitle]
  );

  const addTaskCallback = (title: string) => {
    return addTask(title, todolist.id).unwrap();
  };

  let tasksForTodolist = tasks;
  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatusesObj.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatusesObj.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={todolist.id} />
        ))}
      </div>
      <TasksFilterButtons changeFilter={changeFilter} todolistId={todolist.id} todolistFilter={todolist.filter} />
    </div>
  );
});

type TasksFilterButtonsProps = {
  changeFilter: (filter: FilterValuesType, id: string) => void;
  todolistId: string;
  todolistFilter: string;
};

const TasksFilterButtons = ({ changeFilter, todolistId, todolistFilter }: TasksFilterButtonsProps) => {
  return (
    <div style={{ paddingTop: "10px" }}>
      <Button
        variant={todolistFilter === "all" ? "outlined" : "text"}
        onClick={() => changeFilter("all", todolistId)}
        color={"inherit"}
      >
        All
      </Button>
      <Button
        variant={todolistFilter === "active" ? "outlined" : "text"}
        onClick={() => changeFilter("active", todolistId)}
        color={"primary"}
      >
        Active
      </Button>
      <Button
        variant={todolistFilter === "completed" ? "outlined" : "text"}
        onClick={() => changeFilter("completed", todolistId)}
        color={"secondary"}
      >
        Completed
      </Button>
    </div>
  );
};
