import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../apiClient';
import { FolderType } from '../types/FolderType';

interface FoldersState {
    folders: FolderType[];
    selectedFolder: FolderType | null;
    loading: boolean;
    loadingList: boolean;
    error: string | null;
}

const initialState: FoldersState = {
    folders: [],
    selectedFolder: null,
    loading: false,
    loadingList: false,
    error: null,
};

export const getFoldersByUser = createAsyncThunk<FolderType[], number>(
    'folders/getByUser',
    async (userId, thunkAPI) => {
        try {
            const response = await apiClient.get(`user/${userId}/folders`);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const getFolderById = createAsyncThunk<FolderType, number>(
    'folders/getById',
    async (folderId, thunkAPI) => {
        try {
            const response = await apiClient.get(`/folder/${folderId}`);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);


export const getChildFolders = createAsyncThunk<FolderType[], number>(
    'folders/getChildFolders',
    async (parentId, thunkAPI) => {
        try {
            const response = await apiClient.get(`/folder/children/${parentId}`);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const addNewFolder = createAsyncThunk<FolderType, Partial<FolderType>>(
    'folders/add',
    async (folder, thunkAPI) => {
        try {
            const response = await apiClient.post('/folder', folder);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const updateFolder = createAsyncThunk<FolderType, { id: number, folder: Partial<FolderType> }>(
    'folders/update',
    async ({ id, folder }, thunkAPI) => {

        try {
            const response = await apiClient.put(`/folder/${id}`, { name: folder.name, parentId: folder.parentId });
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const softDeleteFolder = createAsyncThunk<FolderType, number>(
    'folders/softDelete',
    async (folderId, thunkAPI) => {

        try {
            const response = await apiClient.delete(`/folder/soft/${folderId}`);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const softDeleteFolderRecursively = createAsyncThunk<void, number>(
    'folders/softDeleteRecursively',
    async (folderId, thunkAPI) => {
        try {
            await apiClient.delete(`/folder/soft/rec/${folderId}`);
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);
export const deleteFolder = createAsyncThunk<FolderType, number>(
    'folders/delete',
    async (folderId, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/folder/${folderId}`);
            return response.data;
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

export const deleteFolderRecursively = createAsyncThunk<void, number>(
    'folders/deleteRecursively',
    async (folderId, thunkAPI) => {
        try {
            await apiClient.delete(`/folder/rec/${folderId}`);
        } catch (e) {
            return thunkAPI.rejectWithValue(e);
        }
    }
);

const foldersSlice = createSlice({
    name: 'folders',
    initialState,
    reducers: {
        clearSelectedFolder(state) {
            state.selectedFolder = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFoldersByUser.pending, (state) => {
                state.loading = true;
                state.loadingList = true;
                state.error = null;
            })
            .addCase(getFoldersByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.loadingList = false;
                state.folders = action.payload;
            })
            .addCase(getFoldersByUser.rejected, (state, action) => {
                state.loading = false;
                state.loadingList = false;
                state.error = action.error.message || 'Failed to fetch folders by user';
            })
            .addCase(getFolderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFolderById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedFolder = action.payload;
            })
            .addCase(getFolderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch folder';
            })
            .addCase(getChildFolders.pending, (state) => {
                state.loading = true;
                state.loadingList = true;
                state.error = null;
            })
            .addCase(getChildFolders.fulfilled, (state, action) => {
                state.loading = false;
                state.loadingList = false;
                state.folders = action.payload;
            })
            .addCase(getChildFolders.rejected, (state, action) => {
                state.loading = false;
                state.loadingList = false;
                state.error = action.error.message || 'Failed to fetch child folders';
            })
            .addCase(addNewFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addNewFolder.fulfilled, (state, action) => {
                state.loading = false;
                state.folders.push(action.payload as FolderType);
            })
            .addCase(addNewFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to add folder';
            })
            .addCase(updateFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFolder.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.folders.findIndex((folder) => folder.id === action.payload.id);
                if (index !== -1) state.folders[index] = action.payload;
            })
            .addCase(updateFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update folder';
            })
            //soft delete
            .addCase(softDeleteFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(softDeleteFolder.fulfilled, (state, action) => {
                state.loading = false;
                state.folders = state.folders.filter((folder) => folder.id !== action.payload.id);
            })
            .addCase(softDeleteFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete folder';
            })
            //soft delete rec
            .addCase(softDeleteFolderRecursively.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(softDeleteFolderRecursively.fulfilled, (state, action:any) => {
                state.loading = false;
                state.folders = state.folders.filter((folder) => folder.id !== action.payload.id);
            })
            .addCase(softDeleteFolderRecursively.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete folder recursively';
            })
            .addCase(deleteFolder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFolder.fulfilled, (state, action) => {
                state.loading = false;
                state.folders = state.folders.filter((folder) => folder.id !== action.payload.id);
            })
            .addCase(deleteFolder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete folder';
            })
            .addCase(deleteFolderRecursively.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFolderRecursively.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteFolderRecursively.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to delete folder recursively';
            });
    },
});
export const clearSelectedFolder = foldersSlice.actions.clearSelectedFolder;
export default foldersSlice;