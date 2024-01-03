import axios from "axios";

const settings = {
  withCredentials: true,
  headers: {
    "API-KEY": "CG-zB1pFt1jW7a22MoJaidLt8YG",
  },
};

const instance = axios.create({
  baseURL: "https://pro-api.coingecko.com/api/v3/",
  ...settings,
});

export const cryptoAPI = {
  getCoinsList() {
    return instance.get("/coins/list");
  },
  getCoinsMarkets() {
    return instance.get("/coins/markets");
  },
};
