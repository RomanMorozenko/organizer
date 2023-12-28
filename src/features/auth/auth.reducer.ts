import { authAPI, LoginParamsType } from "common/api/todolists-api";
// import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appThunks } from "app/app.reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logOutTC.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;

// thunks

const loginTC = createAppAsyncThunk<{ isLoggedIn: true }, { data: LoginParamsType }>(
  "auth/logIn",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.login(arg.data);
      if (res.data.resultCode === 0) {
        dispatch(appThunks.initializeAppTC());
        return { isLoggedIn: true };
      } else {
        const isShowAppError = !res.data.fieldsErrors.length;
        console.log(res.data.fieldsErrors.length);
        // handleServerAppError(res.data, dispatch, isShowAppError);
        return rejectWithValue(res.data);
      }
    } catch (err: unknown) {
      // handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

const logOutTC = createAppAsyncThunk<{ isLoggedIn: boolean }>("auth/logOut", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(clearTasksAndTodolists());
      return { isLoggedIn: false };
    } else {
      // handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (err: unknown) {
    // handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const authThunks = { loginTC, logOutTC };
