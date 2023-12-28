import { getWeather } from "./../../features/weather/weather.reducer";
import { AppDispatch } from "app/store";

type useLocationProps = {
  dispatch: AppDispatch;
  getWeather: typeof getWeather;
};

export const useUserLocation = ({ dispatch, getWeather }: useLocationProps) => {
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const showPosition = (position: GeolocationPosition) => {
    let data = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
    dispatch(getWeather(data));
  };

  return { getLocation };
};
