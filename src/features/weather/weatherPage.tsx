import { useEffect, useState } from "react";
import { getAutoComplete, getWeather } from "./weather.reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { weatherSelectors } from ".";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import s from "./weather.module.css";
import { useUserLocation } from "common/hooks/useUserLocation";

export const WeatherPage = () => {
  const dispatch = useAppDispatch();
  const { getLocation } = useUserLocation({ dispatch, getWeather });

  useEffect(() => {
    getLocation();
  }, []);

  return <WeatherModule />;
};

const WeatherModule = () => {
  const temperature = useSelector(weatherSelectors.temperature);
  const city = useSelector(weatherSelectors.city);
  const description = useSelector(weatherSelectors.description);
  return (
    <div className={s.container}>
      <CityInput city={city} />
      <div className={s.display}>
        <p>City: {city}</p>
        <p>Temperature: {temperature.toString().split(".")[0]}</p>
        <p>Description: {description}</p>
      </div>
    </div>
  );
};

type CityInputProps = {
  city: string;
};

export const CityInput = ({ city }: CityInputProps) => {
  const [inputValue, setInputValue] = useState(city);

  const dispatch = useAppDispatch();
  const autocompleteValues = useSelector(weatherSelectors.autocompleteValues);

  let handleOnChange = async (value: string) => {
    setInputValue(value);
    dispatch(getAutoComplete(value));
  };

  handleOnChange = debounce(handleOnChange);

  const onSelectChange = (value: string) => {
    dispatch(getWeather({ city: value }));
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={autocompleteValues}
      onChange={(e, value) => onSelectChange(value || "")}
      renderOption={(props, option) => {
        const newKey = Math.random();
        return (
          <li {...props} key={newKey}>
            {option}
          </li>
        );
      }}
      renderInput={(params) => {
        return (
          <TextField {...params} label="City" value={inputValue} onChange={(e) => handleOnChange(e.target.value)} />
        );
      }}
    />
  );
};

type ThisArgType = { [key: string]: any };

const debounce = (fn: (...args: any[]) => void, delay = 500) => {
  let timeout: any;
  return function (this: ThisArgType, ...args: any[]): Promise<void> {
    const context = this;
    function newFn() {
      fn.apply(context, args);
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(newFn, delay);
    return new Promise(() => null);
  };
};
