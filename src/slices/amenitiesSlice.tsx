import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

const endpoints = {
    createApi: '/amenities/store',  
    listApi: '/amenities/show',
    destoryApi: '/amenities/delete',
    editApi: '/amenities/edit',
};

export const storeAmenities = createAsyncThunk('storeamenities', async ({ formData, id }: { formData: FormData; id?: number }, { rejectWithValue }) => {
    try {
        const url = id ? `${endpoints.createApi}/${id}` : endpoints.createApi;
        const response = await apiClient.post(url, formData);
        return response.data;
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
    status    : 0, 
    editAmenity: null as { id?: number; name?: string } | null,
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
            state.status = action.payload.state;
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
            state.success =  true;
            state.editAmenity = action.payload;
            state.message = 'Amenities fetched for edit successfully';
            
        })
    },
});
// export const { setAmenities } = AmenitiesSlice.actions
export default AmenitiesSlice.reducer;