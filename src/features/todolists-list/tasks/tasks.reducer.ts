import { TodolistType } from "common/api/todolists-api";
import { TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType } from "common/api/tasks-api";
// import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils";
// import { appActions } from "app/app.reducer";
import { todoListThunks } from "features/todolists-list/todolists/todolists.reducer";
import { createSlice } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { thunkTryCatch } from "common/utils/thunk-try-catch";
import { tasksAPI } from "common/api/tasks-api";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(todoListThunks.addTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todoListThunks.removeTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload];
      })
      .addCase(todoListThunks.fetchTodolistsTC.fulfilled, (state, action) => {
        action.payload.forEach((tl: TodolistType) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearTasksAndTodolists, () => {
        return {};
      })
      .addCase(fetchTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(removeTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) tasks.splice(index, 1);
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.model };
        }
      });
  },
});

const fetchTasksTC = createAppAsyncThunk<{todolistId:string,tasks:TaskType[]}, { todolistId: string }>('tasks/fetchTasks',
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await tasksAPI.getTasks(arg.todolistId);
      return { todolistId: arg.todolistId, tasks: res.data.items }
    } catch (err: unknown) {
      // handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  });

const removeTaskTC = createAppAsyncThunk<{ todolistId: string, taskId: string }, { todolistId: string, taskId: string }>('tasks/removeTask',
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await tasksAPI.deleteTask(arg.todolistId, arg.taskId)
      if (res.data.resultCode === 0) {
        return { todolistId: arg.todolistId, taskId: arg.taskId }
      } else {
        // handleServerAppError(res.data, dispatch);
        return rejectWithValue(null)
      }
    } catch (err: unknown) {
      // handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  })

const addTaskTC = createAppAsyncThunk<{task:TaskType}, { todolistId: string, title: string }>('tasks/addTask',
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI,async ()=> {
      const res = await tasksAPI.createTask(arg.todolistId, arg.title);
      if (res.data.resultCode === 0) {
        const task = res.data.data.item
        return {task}
      } else {
        // handleServerAppError(res.data, dispatch);
        return rejectWithValue(null)
      }
    })
  })


const updateTaskTC = createAppAsyncThunk<{ taskId:string, model: any, todolistId:string }, { taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }>('tasks/updateTask',
  async ({ todolistId, taskId, domainModel }, thunkAPI) => {
    console.log(domainModel)
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      console.warn("task not found in the state");
      return rejectWithValue(null)
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    try {
      const res = await tasksAPI.updateTask(todolistId, taskId, apiModel);
      if (res.data.resultCode === 0) {
        return { taskId, model: domainModel, todolistId }
      } else {
        // handleServerAppError(res.data, dispatch);
        return rejectWithValue(null)
      }
    } catch (err: unknown) {
      // handleServerNetworkError(err, dispatch);
      return rejectWithValue(null)
    }
  })

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasksTC, removeTaskTC, addTaskTC, updateTaskTC }

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
