import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { FileType } from '../types/FileType';
import apiClient from '../apiClient';

interface FilesState {
    files: FileType[];
    selectedFile:FileType | null;
    loading: boolean;
    error: string | null;
}

const initialState: FilesState = {
    files: [],
    selectedFile:null,
    loading: false,
    error: null,
};

const baseUrl = '/file'

// export const getAllFiles = createAsyncThunk<FileType[], void>(
//     'files/getAll',
//     async (_, thunkAPI) => {
//         try {
//             const response = await apiClient.get('file');
//             return response.data; 
//         } catch (e) {
//             return thunkAPI.rejectWithValue(e);
//         }
//     }
// );

//כל הקבצים שבתיקית השורש
export const getFilesByUser = createAsyncThunk<FileType[], number>(
    'files/fetchRootFilesByUser',
    async (userId, thunkAPI) => {
        try {
            const response = await apiClient.get(`user/${userId}/files`);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);


export const getChildFiles = createAsyncThunk<FileType[],  number>(
    'files/getChildFiles',
    async (parentId , thunkAPI) => {
        try {
            const response = await apiClient.get(`/file/children/${parentId}`);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);



// export const getAllFilesByUser = createAsyncThunk<FileType[], number>(
//     'files/getFilesByUserId',
//     async (id:number, thunkAPI) => {
//         try {
//             const response = await apiClient.get(`user/${id}/files`);
//             return response.data; 
//         } catch (e) {
//             return thunkAPI.rejectWithValue(e);
//         }
//     }
// );

export const getFileByID = createAsyncThunk<FileType, number>(
    'files/getById',
    async (fileId:number, thunkAPI) => {
        try {
            const response = await axios.get(`${baseUrl}/${fileId}`);
            return response.data; 
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const addFile = createAsyncThunk<FileType, Partial<FileType>>(
    'files/add',
    async (file: Partial<FileType>, thunkAPI) => {
        
        try {
            const response = await apiClient.post('/file', file);
            return response.data; 
        } catch (e) {          
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const updateFile = createAsyncThunk<FileType, {id:number, file:FileType}>(
    'files/update',
    async ({id, file}:{id:number, file:FileType}, thunkAPI) => {
        try {
            const response = await apiClient.put(`${baseUrl}/${id}`, file);
            return response.data; 
        } catch (e) {          
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const deleteFile = createAsyncThunk<FileType, number>(
    'files/delete',
    async (id:number, thunkAPI) => {
        try {
            const response = await apiClient.delete(`${baseUrl}/${id}`);
            return response.data; 
        } catch (e) {          
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const softDeleteFile = createAsyncThunk<FileType, number>(
    'files/softDelete',
    async (id:number, thunkAPI) => {
        try {
            const response = await apiClient.delete(`${baseUrl}/soft/${id}`);
            return response.data; 
        } catch (e) {          
            return thunkAPI.rejectWithValue(e);
        }
    }
);

const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        
            //getAllFilesByUserId
            // .addCase(getAllFilesByUser.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(getAllFilesByUser.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.files = action.payload;
            //     state.selectedFile = null;
            // })
            // .addCase(getAllFilesByUser.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.payload as string;
            // })
            //getFilesByUser
            .addCase(getFilesByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFilesByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.files = action.payload;
                state.selectedFile = null;
            })
            .addCase(getFilesByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //getChildFiles
            .addCase(getChildFiles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChildFiles.fulfilled, (state, action) => {
                state.loading = false;
                state.files = action.payload;
                state.selectedFile = null;
            })
            .addCase(getChildFiles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //getById
            .addCase(getFileByID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFileByID.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFile = action.payload;
            })
            .addCase(getFileByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //add
            .addCase(addFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFile.fulfilled, (state, action) => {
                state.loading = false;
                state.files.push(action.payload as FileType);
                state.selectedFile = action.payload;
            })
            .addCase(addFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //update   
            .addCase(updateFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFile.fulfilled, (state, action) => {
                state.loading = false;             
                const index = state.files.findIndex(u=>u.id===action.payload.id);    
                state.files[index] = action.payload
                state.selectedFile = action.payload;
            })
            .addCase(updateFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            //delete      
            .addCase(deleteFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.loading = false;
                state.files = state.files.filter(u=>u.id!==action.payload.id);    
                state.selectedFile = action.payload;
            })
            .addCase(deleteFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            //soft delete      
            .addCase(softDeleteFile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(softDeleteFile.fulfilled, (state, action) => {
                state.loading = false;
                state.files = state.files.filter(u=>u.id!==action.payload.id);    
                state.selectedFile = action.payload;
            })
            .addCase(softDeleteFile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default filesSlice