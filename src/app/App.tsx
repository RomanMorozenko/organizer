import React, { useCallback, useEffect } from "react";
import "./App.css";
import { TodolistsList } from "features/todolists-list/todolists/TodolistsList";
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar";
import { useSelector } from "react-redux";
import { appThunks } from "app/app.reducer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "features/auth/Login";
import { authThunks } from "features/auth/auth.reducer";
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { authSelectors } from "features/auth";
import { appSelectors } from "app";

function App() {
  const status = useSelector(appSelectors.selectAppStatus);
  const isInitialized = useSelector(appSelectors.selectIsInitialized);
  const isLoggedIn = useSelector(authSelectors.isLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(appThunks.initializeAppTC());
  }, []);

  const logoutHandler = useCallback(() => {
    dispatch(authThunks.logOutTC());
  }, []);

  if (!isLoggedIn && !isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <ErrorSnackbar />
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6">News</Typography>
            {isLoggedIn && (
              <Button color="inherit" onClick={logoutHandler}>
                Log out
              </Button>
            )}
          </Toolbar>
          {status === "loading" && <LinearProgress />}
        </AppBar>
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<TodolistsList />} />
            <Route path={"/login"} element={<Login />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
