import axios from "axios";

const API_KEY = "e8159202cac7075771f854eb1f5f83c5";

const instance = axios.create({
  baseURL: "https://api.openweathermap.org/",
});

export const weatherAPI = {
  getCoordinates(city: string) {
    return instance.get<any>(`geo/1.0/direct?q=${city}&appid=${API_KEY}`);
  },
  getWeather(lat: number, lon: number) {
    return instance.get<any>(`data/2.5/weather?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}&units=metric`);
  },
};
