import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk('auth/cover-login', async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    const response = await axios.post('/api/login', credentials);
    return response.data;
});

export const signupUser = createAsyncThunk('auth/signupUser', async (userData) => {
    const response = await axios.post('/api/signup', userData);
    return response.data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState: { isAuthenticated: false, user: null, error: null, token: null },
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
        //fullfilled
        //pending
        //rejected
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.token = null;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
