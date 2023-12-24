import { authAPI } from "common/api/todolists-api";
import { authActions } from "features/auth/auth.reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from 'common/utils/create-app-async-thunk';
// import { handleServerNetworkError } from "common/utils/error-utils";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

export type AppInitialStateType = typeof initialState;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
  },
  extraReducers: builder => {
    builder
    .addCase(initializeAppTC.fulfilled, (state, action) => {
      state.isInitialized = action.payload.isInitialized;
    })
    .addMatcher(
      (action) => {
        return action.type.endsWith('/pending')
      },
      (state,action) => {
        console.log(action)
        state.status = 'loading'
      }
    )
    .addMatcher(
      (action) => {
        return action.type.endsWith('/fulfilled')
      },
      (state,action) => {
        console.log(action)
        state.status = 'succeeded'
      }
    )
    .addMatcher(
      (action) => {
        return action.type.endsWith('/rejected')
      },
      (state,action) => {
        console.log('addMatcher rejected')
        console.log(action)
        if (action.payload) {
          state.error = action.payload.messages[0]
        } else {
          state.error = action.error.message ? action.error.message : 'Some error occurred'
        }
        state.status = 'failed'
      }
    )
  }
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;


export const initializeAppTC = createAppAsyncThunk<{ isInitialized: boolean }>('app/initializeApp',
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.me()
      if (res.data.resultCode === 0) {
        dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
      } else {
        return rejectWithValue(null)
      }
    } catch (err: unknown) {
      // handleServerNetworkError(err, dispatch);
      return rejectWithValue(null)
    } finally {
      return { isInitialized: true }
    }
  })

export const appThunks = { initializeAppTC }

