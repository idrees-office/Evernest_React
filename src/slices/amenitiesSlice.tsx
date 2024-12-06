import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

const endpoints = {
    createApi: '/amenities/store',  
    listApi: '/amenities/show',
    destoryApi: '/amenities/delete',
    editApi: '/amenities/edit',
    updateApi: '/amenities/update',
};

export const storeAmenities = createAsyncThunk('storeamenities', async ({ formData, id }: { formData: FormData; id?: number }, { rejectWithValue }) => {
    try {
        let response;
        if (id) {
            response = await apiClient.put(`${endpoints.updateApi}/${id}`, formData);
        } else {
            response = await apiClient.post(endpoints.createApi, formData);
        }
        return response;

        // return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const showAmenities = createAsyncThunk('showamenities', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(endpoints.listApi);
        return response.data;

    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const destoryAmenities = createAsyncThunk('destoryamenities', async (id: number, { rejectWithValue }) => {
    try {
        await apiClient.delete(`${endpoints.destoryApi}/${id}`);
        return { id };
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const editAmenities = createAsyncThunk('editamenities', async (id: number, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(`${endpoints.editApi}/${id}`);
        return response.data;
    } catch (error: any) {}
});

const initialState = {
    amenities: [] as { id: number; title: string; content: string, }[],
    success   : false,
    message   : '',
    loading   : false,
};

const AmenitiesSlice = createSlice({
    name: 'Amenities',
    initialState,
    reducers: {
      //setAmenities() {},
    },
    extraReducers(builder) {
        builder.addCase(storeAmenities.fulfilled, (state, action) => {
            state.success = true;
            state.amenities.push(action.payload.data);
        })
        .addCase(storeAmenities.rejected, (state, action) => {
             state.success = true;
             action.payload;
        })
        .addCase(showAmenities.fulfilled, (state, action) => {
            state.success = true;          
            state.amenities = action.payload;
            state.message = 'Amenities fetched successfully';
            state.loading = false;
        })
        .addCase(showAmenities.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(destoryAmenities.fulfilled, (state, action) => {
            state.success =  true;
            const { id } = action.payload;
            state.amenities = state.amenities.filter((amenitie) => amenitie.id !== id)
            state.message = 'Amenities deleted successfully';
        })

        .addCase(editAmenities.fulfilled, (state, action) => {
            state.amenities = action.payload;
            state.message = 'Amenities fetched for edit successfully';
            
        })
    },
});
// export const { setAmenities } = AmenitiesSlice.actions
export default AmenitiesSlice.reducer;