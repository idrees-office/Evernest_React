import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBaseUrl } from '../components/BaseUrl';
import apiClient from '../utils/apiClient';

const baseURL = getBaseUrl();
const endpoints = {
    createApi: `${baseURL}/blogs/create`,
    listApi: `${baseURL}/blogs/list`,
};

export const createBlog = createAsyncThunk('pages/blogs/create', async (credentials: Record<string, any>, { rejectWithValue }) => {
    const response = apiClient.post(endpoints.createApi, credentials);
});

export const listBlog = createAsyncThunk('pages/blogs/list', async (_, { rejectWithValue }) => {
    const response = apiClient.get(endpoints.listApi);
});

const blogSlice = createSlice({
    name: 'Blogs',
    initialState: { isAuthenticated: false },
    reducers: {
        setBlogs() {},
        deleteBlogsById() {},
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBlog.fulfilled, (state, action) => {
                console.log(action);
            })
            .addCase(listBlog.fulfilled, (state, action) => {
                console.log(action);
            });
    },
});

export const { setBlogs, deleteBlogsById } = blogSlice.actions;
export default blogSlice.reducer;

// const blogSlice
