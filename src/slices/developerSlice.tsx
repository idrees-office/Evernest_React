import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

const endpoints = {
    createApi: '/developers/create',
    listApi: '/developers/show',
    destoryApi: '/developers/delete',
    editApi: '/developers/edit',
    updateApi: '/developers/update',
};

export const storeDeveloper = createAsyncThunk('storedeveloper', async ({ formData, id }: { formData: FormData; id?: number }, { rejectWithValue }) => {
    try {
        let response;
        if (id) {
            response = await apiClient.put(`${endpoints.updateApi}/${id}`, formData);
        } else {
            response = await apiClient.post(endpoints.createApi, formData);
        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const showDeveloper = createAsyncThunk('showdeveloper', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(endpoints.listApi);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const destoryDeveloper = createAsyncThunk('destorydeveloper', async (id: number, { rejectWithValue }) => {
    try {
        await apiClient.delete(`${endpoints.destoryApi}/${id}`);
        return { id };
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const editDeveloper = createAsyncThunk('editdebeloper', async (id: number, { rejectWithValue }) => {
    try {
        const res = await apiClient.get(`${endpoints.editApi}/${id}`);
        return res.data;
    } catch (error: any) {}
});

const initialState = {
    developers: [] as { id: number; title: string; content: string }[],
    success: false,
    message: '',
    loading: false,
};

const DeveloperSlice = createSlice({
    name: 'Developers',
    initialState,
    reducers: {
        // setDevelopers() {},
    },
    extraReducers(builder) {
        builder.addCase(storeDeveloper.fulfilled, (state, action) => {
            state.success = true;
            state.developers.push(action.payload);
        })
        .addCase(storeDeveloper.rejected, (state, action) => {
             state.success = true;
             action.payload;
        })
        .addCase(showDeveloper.fulfilled, (state, action) => {
            state.success = true;
            state.developers = action.payload.data;
            state.message = 'Developers fetched successfully';
            state.loading = false;
        })
        .addCase(destoryDeveloper.fulfilled, (state, action) => {
            state.success = true;
            const { id } = action.payload;

            console.log(state.developers)




            // state.developers = state.developers.daa.filter((developer) => developer.id == id)
            // state.message = 'Developers deleted successfully';
        }).addCase(editDeveloper.fulfilled, (state, action) => {
            state.developers = action.payload;

            console.log(state.developers);

            state.message = 'Developers fetched for edit successfully';
        })
    },
});

// export const { setDevelopers } = DeveloperSlice.actions
export default DeveloperSlice.reducer;