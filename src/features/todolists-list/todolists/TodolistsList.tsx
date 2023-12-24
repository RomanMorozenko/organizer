import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { todoListThunks } from "features/todolists-list/todolists/todolists.reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "components/AddItemForm/AddItemForm";
import { Todolist } from "./todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useTodoLists } from "./useTodoLists";
import { todolistsSelectors } from "../todolists";
import { authSelectors } from "features/auth";

export const TodolistsList = () => {
  const todolists = useSelector(todolistsSelectors.todolists);
  const isLoggedIn = useSelector(authSelectors.isLoggedIn);
  const { addTodolist } = useTodoLists();

  const dispatch = useAppDispatch();

  const addTodolistCallback = (title: string) => {
    return addTodolist(title).unwrap();
  };

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    const thunk = todoListThunks.fetchTodolistsTC();
    dispatch(thunk);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist todolist={tl} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
