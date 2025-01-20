import apiClient from '../utils/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

const endpoints = {
    loginApi: '/auth/login',
    register: '/auth/register',
    logout: 'auth/logout',
};

export const loginUser = createAsyncThunk('auth/cover-login', async ({ formData }: { formData: FormData; }, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(endpoints.loginApi, formData);
        // console.log('data');
        // console.log(response);
        return {data: response.data.data, status: response.status, message:response.data.message};
    } catch (error: any) {
        return rejectWithValue({data: error.response.data, status: error.status, message:error.response.data.message});
    }
  });

export const signupUser = createAsyncThunk('auth/signupUser', async (userData) => {
    const response = await apiClient.post(endpoints.register, userData);
    return response.data;
});

const savedUser = localStorage.getItem('authUser');
let parsedUser = null;
if (savedUser) {
    try {
        parsedUser = JSON.parse(savedUser); 
    } catch (e) {
        localStorage.removeItem('authUser');
    }
}

const initialState = {
    isAuthenticated: !!localStorage.getItem('authToken'),
    user: parsedUser, 
    error: null,
    success: false,
    message : '',
    status : 0,
    token: localStorage.getItem('authToken') || null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.data.user;
                state.token = action.payload.data.token;
                state.error = null;
                state.status =  action.payload.status
                state.message = action.payload?.message;
                localStorage.setItem('authToken', action.payload.data.token);
                localStorage.setItem('authUser', JSON.stringify(action.payload.data.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.success = false;
                action.payload;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.token = action.payload.token;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
