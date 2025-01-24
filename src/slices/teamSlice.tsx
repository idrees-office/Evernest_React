import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../utils/apiClient';

const endpoints = {
    createApi  : '/users/create_user',
    roleApi    : '/users/get_user_role',
    listApi    : '/users/user_list',
    updateApi  : '/users/create_user',
    destoryApi : '/users/delete_user',
    editApi    : '/users/edit_user',

};

export const createuser = createAsyncThunk('createuser', async ({ formData, id }: { formData: FormData; id?: number }, { rejectWithValue }) => {
    try {
        let response;
        if (id) {
            response = await apiClient.put(`${endpoints.updateApi}/${id}`, formData);
        } else {
            response = await apiClient.post(endpoints.createApi, formData);
        }
        return { data: response?.data, status: response?.status };
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const userlist = createAsyncThunk('userlist', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(endpoints.listApi);
        return { data: response?.data, status: response?.status };
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});
export const userroles = createAsyncThunk('userroles', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(endpoints.roleApi);   
        return { data: response?.data, status: response?.status };
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const destoryuser = createAsyncThunk('destoryuser', async (id: number, { rejectWithValue }) => {
    try {
        await apiClient.delete(`${endpoints.destoryApi}/${id}`);
        return { id };
    } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const edituser = createAsyncThunk('edituser', async (id: number, { rejectWithValue }) => {
    try {
        const res = await apiClient.get(`${endpoints.editApi}/${id}`);
        return res.data;
    } catch (error: any) {}
});

const initialState = {
    team: [] as { id: number; title: string; content: string }[],
    roles: [] as {
        name: any; id: number; title: string; content: string 
}[],
    success: false,
    message: '',
    loading: false,
};

const TeamSlice = createSlice({
    name: 'News',
    initialState,
    reducers: {
        setTeam() {},
    },
    extraReducers: (builder) => {
        builder
            .addCase(createuser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(createuser.fulfilled, (state, action) => {
                state.success = true;
                state.team.push(action.payload.data);
                state.loading = false;
            })
            .addCase(userlist.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(userlist.fulfilled, (state, action) => {
                state.success = true;
                state.team = action.payload.data;
                state.loading = false;
            })
            .addCase(userroles.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(userroles.fulfilled, (state, action) => {
                state.success = true;
                state.roles = action.payload.data;
                state.loading = false;
            })
            .addCase(destoryuser.fulfilled, (state, action) => {
                state.success =  true;
                const { id } = action.payload;
                state.team = state.team.filter((client) => client.id !== id)
            })
            
            .addCase(edituser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(edituser.fulfilled, (state, action) => {
                state.loading =  false;
                state.team = action.payload;
               
            })

    },
});

export const { setTeam } = TeamSlice.actions;
export default TeamSlice.reducer;
