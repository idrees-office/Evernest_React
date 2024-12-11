import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

const endpoints = {
     createApi  : '/blogs/store',
     listApi    : '/blogs/show',
     destoryApi : '/blogs/delete',
     editApi    : '/blogs/edit',
    };

    export const createBlog = createAsyncThunk('createblog', async ({ formData, id }: { formData: FormData; id?: number }, { rejectWithValue }) => {
        try {
            const url = id ? `${endpoints.createApi}/${id}` : endpoints.createApi;
            const response = await apiClient.post(url, formData);
            return {data: response.data, status: response.status};
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

    export const listBlog = createAsyncThunk('createlist', async (_, { rejectWithValue }) => {
        try {
            const listresponse = await apiClient.get(endpoints.listApi);
            return listresponse.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

    export const deleteBlog = createAsyncThunk('deletelist', async (id: number, { rejectWithValue }) => { 
            try {
                await apiClient.delete(`${endpoints.destoryApi}/${id}`);
                return { id };
            } catch (error: any) {
                return rejectWithValue(error.response?.data || error.message);
            }
     });
    export const editBlog = createAsyncThunk('editlits', async (id: number, { rejectWithValue }) => { 
        try {
            const editResponse = await apiClient.get(`${endpoints.editApi}/${id}`); 
            return editResponse.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });
    
    const initialState = {
        blogs: [] as { id: number; title: string; content: string }[],
        success: false,
        loading: false,
        message : '',
        status : 0,
    };

const blogSlice = createSlice({
    name: 'Blogs',
    initialState,
    reducers: {
        setBlogs() {},
        deleteBlogsById() {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBlog.fulfilled, (state, action) => {
                state.success = true;
                state.status =  action.payload.status
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.success = true;                
                action.payload; 
            })
            .addCase(listBlog.pending, (state) => {
                state.loading = true;  
            })
            .addCase(listBlog.fulfilled, (state, action) => {
                state.success = true;
                state.blogs = action.payload; 
                state.message = 'Blogs fetched successfully';
                state.loading = false;  
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.success = true;
                const { id } = action.payload;
                state.blogs = state.blogs.filter((blog) => blog.id !== id);  
                state.message = 'Blog deleted successfully';
            })
            .addCase(editBlog.fulfilled, (state, action) => {
                state.blogs = action.payload; 
                state.message = 'Blog fetched for edit successfully';
            });
    }
});

export const { setBlogs, deleteBlogsById } = blogSlice.actions;
export default blogSlice.reducer;