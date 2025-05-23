import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './usersSlice';
import filesSlice from './filesSlice';
import authSlice from './authSlice';
import foldersSlice from './foldersSlice';
import editorAiSlice from './editorAiSlice';
import aiDesignSlice from './aiDesignSlice';
import undoableAiDesignSlice from './aiDesignSlice';

const store = configureStore({
    reducer:
    {
        users: usersSlice.reducer,
        files: filesSlice.reducer,
        folders: foldersSlice.reducer,
        auth: authSlice.reducer,
        editorAi: editorAiSlice.reducer,
        aiDesign: undoableAiDesignSlice,
    }

});

export type StoreType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;