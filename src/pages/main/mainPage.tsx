import { authSelectors } from "features/auth";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import s from "./mainPage.module.css";

type AppSection = "todolist" | "weather" | "currency" | "crypto";
const appSections: AppSection[] = ["todolist", "weather", "currency", "crypto"];

export const MainPage = () => {
  const isLoggedIn = useSelector(authSelectors.isLoggedIn);
  const navigate = useNavigate();
  if (!isLoggedIn) {
    navigate("/login");
  }

  return (
    <div className={s.mainPageContainer}>
      {appSections.map((section) => (
        <MainPageItem key={section} section={section} />
      ))}
    </div>
  );
};

type MainPageItemProps = {
  section: "todolist" | "weather" | "currency" | "crypto";
};

const MainPageItem = ({ section }: MainPageItemProps) => {
  const navigate = useNavigate();
  const className =
    section === "todolist"
      ? s.todolist
      : section === "crypto"
      ? s.crypto
      : section === "currency"
      ? s.currency
      : s.weather;

  const handleOnClick = () => {
    navigate(section);
  };
  return <div onClick={handleOnClick} className={s.mainPageItem + " " + className}></div>;
};
