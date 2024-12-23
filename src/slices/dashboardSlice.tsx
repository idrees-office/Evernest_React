import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

    const endpoints = {
        createApi  : '/leads/store',
        listApi    : '/leads/get_all_leads',
        destoryApi : '/leads/delete',
        editApi    : '/leads/edit',
        updateLead : '/leads/update_single_lead',
    };

    export const createLeads = createAsyncThunk('createlead', async ({ formData, id }: { formData: FormData; id?: number }, { rejectWithValue }) => {
        try {
            const url = id ? `${endpoints.createApi}/${id}` : endpoints.createApi;
            const response = await apiClient.post(url, formData);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });
    export const Leadslist = createAsyncThunk('Leadslist', async ({ formData, status }: { formData: FormData; status?: number }, { rejectWithValue }) => {
          try {
            const url = status ? `${endpoints.listApi}/${status}` : endpoints.listApi;
            const response = await apiClient.post(url, formData);
            return {leadsdata: response.data, status: response.status};
          } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
          }
        }
      );
      
      export const updateSingleLead = createAsyncThunk('updateSingleLead', async ({ formData, id }: { formData: FormData; id?: number }, { rejectWithValue }) => {
        try {
            const url = id ? `${endpoints.updateLead}/${id}` : endpoints.updateLead;
            const response = await apiClient.post(url, formData);
            return {data: response?.data.data, status: response?.status};
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

    export const deleteLeads = createAsyncThunk('deleteleads', async (id: number, { rejectWithValue }) => { 
            try {
                await apiClient.delete(`${endpoints.destoryApi}/${id}`);
                return { id };
            } catch (error: any) {
                return rejectWithValue(error.response?.data || error.message);
            }
     });
    export const editLeads = createAsyncThunk('editleads', async (id: number, { rejectWithValue }) => { 
        try {
            const editResponse = await apiClient.get(`${endpoints.editApi}/${id}`); 
            return editResponse.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });
    
    const initialState = {
        leads: [],
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
        deleteLeadsById() {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(createLeads.fulfilled, (state, action) => {
                state.success = true;
                state.status =  action.payload.status
            })
            .addCase(createLeads.rejected, (state, action) => {
                state.success = true;                
                action.payload; 
            })
            .addCase(Leadslist.pending, (state) => {
                state.loading = true;  
            })
            .addCase(Leadslist.fulfilled, (state, action) => {
                state.success = true;
                state.leads = action.payload.leadsdata?.data || [];
                state.loading = false;
            })
            .addCase(updateSingleLead.fulfilled, (state, action) => {
                state.success = true;
                state.status =  action.payload.status

                console.log(action.payload?.data);

                // state.leads = action.payload?.data.singlelead || [];
                action.payload?.data

                // state.leads.find(action.payload?.data.singlelead)
                // state.leads.push(action.payload?.data.singlelead);
                // state.leads = action.payload?.data.singlelead || [];

                // console.log(action.payload.data);
                // state.leads = action.payload.data?.data || [];
            })
            .addCase(deleteLeads.fulfilled, (state, action) => {
                state.success = true;
                const { id } = action.payload;
                // state.leads = state.leads.filter((blog) => blog.id !== id);  
            })
            .addCase(editLeads.fulfilled, (state, action) => {
                state.leads = action.payload; 
            });
    }
});

export const { setLeads, deleteLeadsById } = LeadsSlice.actions;
export default LeadsSlice.reducer;