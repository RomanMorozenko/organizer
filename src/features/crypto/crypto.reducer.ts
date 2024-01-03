import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cryptoAPI } from "common/api/crypto-api";

type InitialStateType = {};

const initialState = {};

const slice = createSlice({
  name: "crypto",
  initialState,
  reducers: {},
});

export const getCoinsList = createAsyncThunk<any, any>("crypto/getCoinsList", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    let response = await cryptoAPI.getCoinsList();
    console.log(response);
  } catch (err: any) {}
});
