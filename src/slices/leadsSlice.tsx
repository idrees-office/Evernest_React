import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

    const endpoints = {
        listApi          : '/leads/new-unassigned-lead',
        destoryApi       : '/leads/delete_leads',
        reAssignApi      : '/leads/reassign-lead-list',
        closeLeadsApi    : '/leads/close-deal',
        allLeadsApi      : '/leads/all-leads',
        pdfurl           : 'leads/filter-pdf-data',
        roadshowLeadApi  : 'leads/roadshow-leads',
        assignLeadsApi   : 'leads/assign-multiple-lead'
    };

    export const newleads = createAsyncThunk('newleads', async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(endpoints.listApi);
            return {data: response.data.data.data, agents: response.data.agents};
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

    export const assignleads = createAsyncThunk('assignleads', async ({ formData }: { formData: FormData; }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(endpoints.assignLeadsApi, formData);
            return { data: response?.data.data, status: response?.status};
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

    export const reassigleads = createAsyncThunk('reassigleads', async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(endpoints.reAssignApi)
            return {data: response.data.data.data, agents: response.data.agents};
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

    export const closeleads = createAsyncThunk('closeleads', async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(endpoints.closeLeadsApi)
            return {data: response.data.data, agents: response.data.agents};
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

    export const allLeads = createAsyncThunk('allLeads', async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(endpoints.allLeadsApi)
            return {data: response.data.leads, status: response.status, agents: response.data.agents};
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

    export const download = createAsyncThunk('download', async ({ formData }: { formData: FormData; }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(endpoints.pdfurl, formData);
            return {data: response?.data.data, status: response?.status, agent_name:response?.data.agent_name};
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

    export const roadshowleads = createAsyncThunk("roadshowleads", async ({ cityname }: { cityname?: string }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`${endpoints.roadshowLeadApi}/${cityname}`);
            return { data: response.data.data };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    });

    const initialState = {
        leads: [] as { lead_id: number }[],
        agents: [] as { client_user_id: number,  client_user_name: string, client_user_phone: number, }[],
        lead_status: 0,
        success: false,
        loading: false,
        message : '',
        status : 0,
        agent_name : ''
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
        })
        .addCase(reassigleads.pending, (state) => {
            state.loading = true;
        })
        .addCase(reassigleads.fulfilled, (state, action) => {
            state.loading = false;
            state.leads   = action.payload.data;
            state.agents  = action.payload.agents;
        }).addCase(closeleads.pending, (state) => {
            state.loading = true;
        }).addCase(closeleads.fulfilled, (state, action) => {
            state.loading = false;
            state.leads   = action.payload.data;

        }).addCase(allLeads.pending, (state) => {
            state.loading = true;
        })
        .addCase(allLeads.fulfilled, (state, action) => {
            state.loading = false;
            state.leads   = action.payload.data;
            state.agents   = action.payload.agents;
        })
        .addCase(download.pending, (state) => {
            state.loading = true;
        })
        .addCase(download.fulfilled, (state, action) => {
            state.loading = false;
            state.leads   = action.payload.data;
            state.agent_name   = action.payload.agent_name;
        })
        .addCase(roadshowleads.pending, (state) => {
            state.loading = true;
        })
        .addCase(roadshowleads.fulfilled, (state, action) => {
            state.loading = false;
            state.leads   = action.payload.data;
        })
        .addCase(assignleads.pending, (state) => {
            state.loading = true;
        })
        .addCase(assignleads.fulfilled, (state, action) => {
            state.loading = false;

            state.leads   = action.payload.data;
        })

    },
})
export const { setLeads } = LeadsSlice.actions;
export default LeadsSlice.reducer;