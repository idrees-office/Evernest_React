import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

const endpoints = {
    createApi: '/news/store',
    listApi: '/news/show',
    destoryApi: '/news/delete',
    editApi: '/news/edit',
    updateApi: '/news/update',
};
export const CreateNews = createAsyncThunk('createnews', async ({ formData, id }: { formData: FormData; id?: number }, { rejectWithValue }) => {
    try {
        let response;
        if (id) {
            response = await apiClient.put(`${endpoints.updateApi}/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
            response = await apiClient.post(endpoints.createApi, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const listnews = createAsyncThunk('newslist', async (_, { rejectWithValue }) => {
    try {
        const listresponse = await apiClient.get(endpoints.listApi);
        return listresponse.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const deleteNews = createAsyncThunk('deletenewslist', async (id: number, { rejectWithValue }) => {
    try {
        await apiClient.delete(`${endpoints.destoryApi}/${id}`);
        return { id };
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const editNews = createAsyncThunk('editnews', async (id: number, { rejectWithValue }) => {
    try {
        const editResponse = await apiClient.get(`${endpoints.editApi}/${id}`);
        return editResponse.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    news: [] as { id: number; title: string; content: string }[],
    success: false,
    message: '',
    loading: false,
};

const newsSlice = createSlice({
    name: 'News',
    initialState,
    reducers: {
        setNews() {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(CreateNews.fulfilled, (state, action) => {
                state.success = true;
                state.news.push(action.payload);
            })
            .addCase(listnews.pending, (state) => {
                state.loading = true;
            })
            .addCase(listnews.fulfilled, (state, action) => {
                state.success = true;
                state.news = action.payload;
                state.message = 'News fetched successfully';
                state.loading = false;
            })
            .addCase(deleteNews.fulfilled, (state, action) => {
                state.success = true;
                const { id } = action.payload;
                state.news = state.news.filter((news) => news.id !== id);
                state.message = 'Blog deleted successfully';
            })
            .addCase(editNews.fulfilled, (state, action) => {
                state.news = action.payload;
                state.message = 'Blog fetched for edit successfully';
            });
    },
});

export const { setNews } = newsSlice.actions;
export default newsSlice.reducer;
