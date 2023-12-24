import { AppRootStateType } from "app/store";

export const selectTasks = (state: AppRootStateType) => state.tasks;
export const selectTasksForTodolist = (todolistId: string) => (state: AppRootStateType) => state.tasks[todolistId];
