import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { LoginType, UserType } from '../types/UserType';
import apiClient from '../apiClient';

interface UsersState {
    selectedUser:UserType | null;
    loading: boolean;
    error: string | null;
    errorStatus:number | undefined
}

const initialState: UsersState = {
    selectedUser:null,
    loading: false,
    error: null,
    errorStatus: undefined

};

const baseURL = 'http://localhost:5213/api/';





export const getUserByID = createAsyncThunk<UserType, number>(
    'users/getById',
    async (userId:number, thunkAPI) => {
        try {
            const response = await apiClient.get(`user/${userId}`);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const registration = createAsyncThunk<UserType, Partial<UserType>>(
    'users/register',
    async (user: Partial<UserType>, thunkAPI) => {
        try {            
            const response = await axios.post(baseURL+'auth/register', user);
            return response.data; 
        } catch (e) {   
            // const status = e.response? e.response.status :500       
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const login = createAsyncThunk<UserType, LoginType>(
    'users/login',
    async (user: LoginType, thunkAPI) => {
        try {
            const response = await axios.post(baseURL+'auth/login', user);
            return response.data; 
        } catch (e) {  
            console.log(e);
                    
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const updateUser = createAsyncThunk<UserType, {id:number, user:UserType}>(
    'users/update',
    async ({id, user}:{id:number, user:UserType}, thunkAPI) => {
        try {
            const response = await apiClient.put(`auth/${id}`, user);
            return response.data; 
        } catch (e) {   
                   
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const deleteUser = createAsyncThunk<UserType, number>(
    'users/delete',
    async (id:number, thunkAPI) => {
        try {
            const response = await apiClient.delete(`user/${id}`);
            return response.data; 
        } catch (e) {          
            return thunkAPI.rejectWithValue(e);
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        
           

            //getById
            .addCase(getUserByID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserByID.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(getUserByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //register
            .addCase(registration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registration.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(registration.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                console.log();
                
            })

            //update   
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;             
                state.selectedUser = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //delete      
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default usersSlice