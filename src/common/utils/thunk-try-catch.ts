// import { handleServerNetworkError } from "./error-utils";
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { AppDispatch, AppRootStateType } from "app/store";


export const thunkTryCatch = async <T>(
    thunkAPI:BaseThunkAPI<AppRootStateType,unknown,AppDispatch,any>,
    logic:() => Promise<T>
):Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
        return await logic()
    } catch (err) {
        // handleServerNetworkError(err, dispatch);
        return rejectWithValue(null);
    } 
}

// export const thunkTryCatch = async <T>(
//     thunkAPI:BaseThunkAPI<AppRootStateType,unknown,AppDispatch,any>,
//     logic:() => Promise<T>
// ):Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
//     const { dispatch, rejectWithValue } = thunkAPI;
//     try {
//         return await logic()
//     } catch (err) {
//         handleServerNetworkError(err, dispatch);
//         return rejectWithValue(null);
//     } finally {
//         dispatch(appActions.setAppStatus({ status: "idle" }));
//     }
// }