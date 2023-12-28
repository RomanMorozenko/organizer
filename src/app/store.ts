import { tasksReducer } from "features/todolists-list/tasks/tasks.reducer";
import { todolistsReducer } from "features/todolists-list/todolists/todolists.reducer";
import { appReducer } from "app/app.reducer";
import { authReducer } from "features/auth/auth.reducer";
import { configureStore } from "@reduxjs/toolkit";
import { weatherReducer } from "features/weather/weather.reducer";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
    weather: weatherReducer,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
window.store = store;
