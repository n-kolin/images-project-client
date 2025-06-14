import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './usersSlice';
import filesSlice from './filesSlice';
import authSlice from './authSlice';
import foldersSlice from './foldersSlice';
import aiDesignSlice from './aiDesignSlice';

const store = configureStore({
    reducer:
    {
        users: usersSlice.reducer,
        files: filesSlice.reducer,
        folders: foldersSlice.reducer,
        auth: authSlice.reducer,
        aiDesign: aiDesignSlice.reducer,
    }

});

export type StoreType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;