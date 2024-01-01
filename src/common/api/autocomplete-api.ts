import axios from "axios";

const API_KEY = "6e795a1dab5f4a4d8b733f3ecd489c44";

export const autocompleteAPI = (value: string) => {
  return axios.get(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${value}&type=city&format=json&limit=5&apiKey=${API_KEY}`
  );
};
