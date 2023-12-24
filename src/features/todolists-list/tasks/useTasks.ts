import { useCallback } from "react";
import { tasksThunks } from "./tasks.reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { TaskStatuses } from "common/api/tasks-api";

export const useTasks = () => {
  const dispatch = useAppDispatch();

  const removeTask = useCallback(
    function (id: string, todolistId: string) {
      const thunk = tasksThunks.removeTaskTC({ todolistId, taskId: id });
      dispatch(thunk);
    },
    [dispatch]
  );

  const addTask = useCallback(
    function (title: string, todolistId: string) {
      const res = dispatch(tasksThunks.addTaskTC({ todolistId, title }));
      return res;
    },
    [dispatch]
  );

  const changeStatus = useCallback(
    function (id: string, status: TaskStatuses, todolistId: string) {
      dispatch(tasksThunks.updateTaskTC({ taskId: id, domainModel: { status }, todolistId }));
    },
    [dispatch]
  );

  const changeTaskTitle = useCallback(
    function (id: string, newTitle: string, todolistId: string) {
      dispatch(tasksThunks.updateTaskTC({ taskId: id, domainModel: { title: newTitle }, todolistId }));
    },
    [dispatch]
  );

  return { removeTask, addTask, changeStatus, changeTaskTitle };
};
