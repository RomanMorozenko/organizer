import { useEffect, useState } from "react";
import { getWeather } from "./weather.reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { weatherSelectors } from ".";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/lab/Autocomplete";

import s from "./weather.module.css";
import { useUserLocation } from "common/hooks/useUserLocation";
//import { CityInput } from "./cityInput";

export const WeatherPage = () => {
  const city = useSelector(weatherSelectors.city);
  const [cityToSearch, setCityToSearch] = useState(city);
  const dispatch = useAppDispatch();
  const { getLocation } = useUserLocation({ dispatch, getWeather });

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className={s.container}>
      <WeatherModule value={cityToSearch} onChange={setCityToSearch} />
    </div>
  );
};

type WeatherModuleProps = {
  value: string;
  onChange: (city: string) => void;
};

const WeatherModule = ({ value, onChange }: WeatherModuleProps) => {
  const temperature = useSelector(weatherSelectors.temperature);
  const city = useSelector(weatherSelectors.city);
  const description = useSelector(weatherSelectors.description);
  return (
    <div>
      <CityInput value={value} onChange={onChange} />
      <p>{temperature}</p>
      <p>{city}</p>
      <p>{description}</p>
    </div>
  );
};

type CityInputProps = {
  value: string;
  onChange: (city: string) => void;
};

export const CityInput = ({ value, onChange }: CityInputProps) => {
  return (
    <FormControl>
      <TextField
        label="City"
        color="primary"
        focused
        placeholder="Type the city name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
};
