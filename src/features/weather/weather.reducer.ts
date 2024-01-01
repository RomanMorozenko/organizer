import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { autocompleteAPI } from "common/api/autocomplete-api";
import { weatherAPI } from "common/api/weather-api";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";

type WeatherStateType = {
  city: string;
  temp: string;
  description: string;
  autocompleteValues: string[];
};

const initialState: WeatherStateType = {
  city: "",
  temp: "",
  description: "",
  autocompleteValues: [],
};

const slice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setWeatherData(state, action: PayloadAction<SetWeatherDataActionType>) {
      return {
        ...state,
        city: action.payload.city,
        description: action.payload.description,
        temp: action.payload.temp,
      };
    },
    setAutocompleteValues(state, action: PayloadAction<string>) {
      state.autocompleteValues.push(action.payload);
    },
  },
});

export const weatherReducer = slice.reducer;

const { setWeatherData, setAutocompleteValues } = slice.actions;

export const getAutoComplete = createAppAsyncThunk<any, string>(
  "weather/getAutoComplete",
  async (inputValue, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      let res = await autocompleteAPI(inputValue);
      res.data.results.forEach((item: any) => {
        if (item.city && item.city.toLowerCase().includes(inputValue.toLowerCase())) {
          dispatch(setAutocompleteValues(`${item.city},${item.country}`));
        }
        return null;
      });
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

export const getWeather = createAppAsyncThunk<any, GetWeatherArgsType>("weather/getWeather", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  let coordinates;
  try {
    if (arg.city) {
      coordinates = await weatherAPI.getCoordinates(arg.city);
      const response = await weatherAPI.getWeather(coordinates.data[0].lat, coordinates.data[0].lon);
      dispatch(
        setWeatherData({
          city: response.data.name,
          temp: response.data.main.temp,
          description: response.data.weather[0].description,
        })
      );
    } else if (arg.lat && arg.lon) {
      const response = await weatherAPI.getWeather(arg.lat, arg.lon);
      dispatch(
        setWeatherData({
          city: response.data.name,
          temp: response.data.main.temp,
          description: response.data.weather[0].description,
        })
      );
    }
  } catch (err: unknown) {
    return rejectWithValue(null);
  }
});

type SetWeatherDataActionType = {
  city: string;
  temp: string;
  description: string;
};

export type GetWeatherArgsType = {
  city?: string;
  lat?: number;
  lon?: number;
};
