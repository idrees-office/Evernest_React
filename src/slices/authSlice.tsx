import apiClient from '../utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const endpoints = {
    loginApi : '/auth/login',
    register : '/auth/register',
    logout   : 'auth/logout',
    // loginApi : `${baseURL}/auth/login`,
    // register : `${baseURL}/auth/register`,
    // logout   : `${baseURL}/auth/logout`,
};

export const loginUser = createAsyncThunk('auth/cover-login', async (credentials: { client_user_email: string; password: string }, { rejectWithValue }) => {
    const response = await apiClient.post(endpoints.loginApi, credentials);
    return response.data;
});

export const signupUser = createAsyncThunk('auth/signupUser', async (userData) => {
    const response = await apiClient.post(endpoints.register, userData);
    return response.data;
});


// const savedUser = localStorage.getItem('authUser');
// const initialState = {
//     isAuthenticated: !!localStorage.getItem('authToken'), 
//     user: savedUser ? JSON.parse(savedUser) : null, 
//     error: null,
//     token: localStorage.getItem('authToken') || null,
// };

const authSlice = createSlice({
    name: 'auth',
    initialState: { isAuthenticated: false, user: null, error: null, token: null },
    // initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            // localStorage.removeItem('authToken');
            // localStorage.removeItem('authUser');

        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                // state.error = null;
                // localStorage.setItem('authToken', action.payload.token);
                // localStorage.setItem('authUser', JSON.stringify(action.payload.user));
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.token = action.payload.token;
            })
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
