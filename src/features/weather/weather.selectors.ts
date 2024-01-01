import { AppRootStateType } from "app/store";

export const temperature = (state: AppRootStateType) => state.weather.temp;
export const city = (state: AppRootStateType) => state.weather.city;
export const description = (state: AppRootStateType) => state.weather.description;
export const autocompleteValues = (state: AppRootStateType) => state.weather.autocompleteValues;
