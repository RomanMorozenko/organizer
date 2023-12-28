import { todolistsAPI, TodolistType } from "common/api/todolists-api";
import { RequestStatusType } from "app/app.reducer";
// import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { tasksThunks } from "../tasks/tasks.reducer";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { thunkTryCatch } from "common/utils/thunk-try-catch";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.entityStatus = action.payload.entityStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists, () => {
        return [];
      })
      .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
        return action.payload.map((tl: TodolistType) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(addTodolistTC.fulfilled, (state, action) => {
        const newTodolist: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" };
        state.unshift(newTodolist);
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const todo = state.find((todo) => todo.id === action.payload.id);
        if (todo) {
          todo.title = action.payload.title;
        }
      });
  },
});

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;

// thunks

const fetchTodolistsTC = createAppAsyncThunk<TodolistType[]>("todo/fetchTodolists", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await todolistsAPI.getTodolists();
    res.data.forEach((item) => {
      tasksThunks.fetchTasksTC({ todolistId: item.id });
    });
    return res.data;
  } catch (err: unknown) {
    // handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

const removeTodolistTC = createAppAsyncThunk<string, { id: string }>(
  "todo/removeTodolist",
  async ({ id }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "loading" }));
    try {
      const res = await todolistsAPI.deleteTodolist(id);
      dispatch(todolistsActions.changeTodolistEntityStatus({ id, entityStatus: "succeeded" }));
      return id;
    } catch (err: unknown) {
      // handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

const addTodolistTC = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todo/addTodolist",
  async (title, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.createTodolist(title);
      if (res.data.resultCode === 0) {
        return { todolist: res.data.data.item };
      } else {
        // handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    });
  }
);

const changeTodolistTitleTC = createAppAsyncThunk<{ id: string; title: string }, { id: string; title: string }>(
  "todo/changeTodolistTitle",
  async ({ id, title }, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await todolistsAPI.updateTodolist(id, title);
      return { id, title };
    } catch (err: unknown) {
      // handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

export const todoListThunks = { fetchTodolistsTC, removeTodolistTC, addTodolistTC, changeTodolistTitleTC };

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
