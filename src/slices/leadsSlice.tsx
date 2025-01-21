import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

const endpoints = {
    listApi  : '/leads/new-unassigned-lead',
    destoryApi  : '/leads/delete_leads',

};

export const newleads = createAsyncThunk('newleads', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(endpoints.listApi);
        return {data: response.data.data, agents: response.data.agents};
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});


export const destoryLeads = createAsyncThunk('destoryleads', async ({ formData }: { formData: FormData; }, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(endpoints.destoryApi, formData);
        return {data: response?.data.data, status: response?.status};
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});


const initialState = {
    leads: [] as { lead_id: number }[],
    agents: [] as { client_user_id: number,  client_user_name: string, }[],
    lead_status: 0,
    success: false,
    loading: false,
    message : '',
    status : 0,
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
                state.leads   = action.payload.data;
                state.agents  = action.payload.agents;
            })
            .addCase(newleads.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload as string;
            })
            .addCase(destoryLeads.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(destoryLeads.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload.status;  
            });
    },
})
export const { setLeads } = LeadsSlice.actions;
export default LeadsSlice.reducer;