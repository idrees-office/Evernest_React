import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBaseUrl } from '../components/BaseUrl';
import apiClient from '../utils/apiClient';

const endpoints = {
    createApi  : '/blogs/store',
    listApi    : '/blogs/show',
    destoryApi : '/blogs/delete',
    editApi    : '/blogs/edit',
};

export const createBlog = createAsyncThunk('pages/blogs/create', async (credentials: Record<string, any>, { rejectWithValue }) => {
    const response = apiClient.post(endpoints.createApi, credentials);
});

export const listBlog = createAsyncThunk('pages/blogs/list', async ({ type, payload }: { type: 'list' | 'delete' | 'edit'; payload?: any }, { rejectWithValue }) => {
    try {
        switch (type) {
            case 'list':
                const listresponse = await apiClient.get(endpoints.listApi);
                return { type, data: listresponse.data };
            case 'delete':
                await apiClient.delete(`${endpoints.destoryApi}/${payload}`);
                return { type, id: payload };
            case 'edit':
                const editResponse = await apiClient.get(`${endpoints.editApi}/${payload}`);
                return { type, data: editResponse.data };   
            default:
                throw new Error('Invalid action type');
        }
    } catch (error) {
        return rejectWithValue(error);
    }
});


const initialState = {
    blogs: [] as { id: number; title: string; content: string }[],
    success: false,
    message: '',
};

const blogSlice = createSlice({
    name: 'Blogs',
    initialState,
    reducers: {
        setBlogs(state, action: PayloadAction<Array<{ id: number; title: string; content: string }>>) {
            state.blogs = action.payload; // Replace all blogs with new data
        },
        deleteBlogsById() {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBlog.fulfilled, (state, action) => {
                state.success = true;
                state.message = 'Blog created successfully';
            })
            .addCase(listBlog.fulfilled, (state, action) => {
                const { type, data, id } = action.payload;
                switch (type) {
                    case 'list':
                        state.blogs = data;
                        break;
                    case 'delete':
                        state.blogs = state.blogs.filter((blog) => blog.id !== id); 
                        state.success = true;
                        state.message = 'Blog deleted successfully';
                        break;
                    case 'edit':
                        state.blogs = data;
                        break;
                    // case 'update':
                    //     state.blogs = state.blogs.map((blog) => blog.id === updatedBlog.id ? updatedBlog : blog); // Update the specific blog in the state
                    //     state.success = true;
                    //     state.message = 'Blog updated successfully';
                    //     break;
                    default:
                        break;
                }

            });
    },
});

export const { setBlogs, deleteBlogsById } = blogSlice.actions;
export default blogSlice.reducer;
