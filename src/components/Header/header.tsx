import { useAppDispatch } from "common/hooks/useAppDispatch";
import { authSelectors } from "features/auth";
import { authThunks } from "features/auth/auth.reducer";
import { useSelector } from "react-redux";
import { appSelectors } from "app";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import Menu from "@mui/icons-material/Menu";
import s from "./header.module.css";

export const Header = () => {
  const status = useSelector(appSelectors.selectAppStatus);
  const isLoggedIn = useSelector(authSelectors.isLoggedIn);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authThunks.logOutTC());
  };

  const handleMenuClick = (route: string) => {
    navigate(route);
  };

  return (
    <AppBar position="static" style={{ minHeight: "40px" }}>
      <div className={s.toolbar}>
        {/* <IconButton edge="start" color="inherit" aria-label="menu">
          <Menu />
        </IconButton> */}
        {isLoggedIn && (
          <>
            <IconButton edge="start" color="inherit" aria-label="main" onClick={() => handleMenuClick("/")}>
              <HomeIcon titleAccess="Home page" />
            </IconButton>
            <IconButton edge="start" color="inherit" aria-label="todolist" onClick={() => handleMenuClick("/todolist")}>
              <EventNoteIcon />
              <span className={s.menuItemName}>Todolist</span>
            </IconButton>
            <IconButton edge="start" color="inherit" aria-label="weather" onClick={() => handleMenuClick("/weather")}>
              <ThermostatIcon />
              <span className={s.menuItemName}>Weather</span>
            </IconButton>
            <IconButton edge="start" color="inherit" aria-label="currency" onClick={() => handleMenuClick("/currency")}>
              <CurrencyExchangeIcon />
              <span className={s.menuItemName}>Currency</span>
            </IconButton>
            <IconButton edge="start" color="inherit" aria-label="crypto" onClick={() => handleMenuClick("/crypto")}>
              <CurrencyBitcoinIcon />
              <span className={s.menuItemName}>Crypto</span>
            </IconButton>
            <IconButton color="inherit" onClick={logoutHandler}>
              <LogoutIcon />
              <span className={s.menuItemName}>Log out</span>
            </IconButton>
          </>
        )}
        {status === "loading" && <LinearProgress />}
      </div>
    </AppBar>
  );
};
