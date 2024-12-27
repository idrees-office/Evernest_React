import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

const endpoints = {
    listApi  : '/leads/new-unassigned-lead',
};

export const newleads = createAsyncThunk('newleads', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(endpoints.listApi);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const initialState = {
    leads: [] as { lead_id: number }[],
    lead_status: 0,
    success: false,
    loading: false,
    message : '',
};

const LeadsSlice = createSlice({
    name: 'Leads',
    initialState,
    reducers: {
        setLeads() {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(newleads.pending, (state) => {
                state.loading = true;
            })
            .addCase(newleads.fulfilled, (state, action) => {
                state.loading = false;
                state.leads = action.payload.data;
            })
            .addCase(newleads.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload as string;
            });
    },
})
export const { setLeads } = LeadsSlice.actions;
export default LeadsSlice.reducer;