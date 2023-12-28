import React, { useEffect } from "react";
import "./App.css";
import { TodolistsList } from "features/todolists-list/todolists/TodolistsList";
import { ErrorSnackbar } from "components/ErrorSnackbar/ErrorSnackbar";
import { useSelector } from "react-redux";
import { appThunks } from "app/app.reducer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "features/auth/Login";
import { CircularProgress, Container } from "@mui/material";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { authSelectors } from "features/auth";
import { appSelectors } from "app";
import { Header } from "components/Header";
import { MainPage } from "pages/main";
import { CryptoPage } from "pages/crypto";
import { CurrencyPage } from "pages/currency";
import { WeatherPage } from "features/weather";

function App() {
  const isInitialized = useSelector(appSelectors.selectIsInitialized);
  const isLoggedIn = useSelector(authSelectors.isLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(appThunks.initializeAppTC());
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
        <Header />
        <Container fixed>
          <Routes>
            <Route path={"/"} element={<MainPage />} />
            <Route path={"/todolist"} element={<TodolistsList />} />
            <Route path={"/crypto"} element={<CryptoPage />} />
            <Route path={"/currency"} element={<CurrencyPage />} />
            <Route path={"/weather"} element={<WeatherPage />} />
            <Route path={"/login"} element={<Login />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
