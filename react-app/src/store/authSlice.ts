import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../types/UserType";

interface UserState {
    currentUser: UserType | null;
}

const initialState: UserState = {
    currentUser: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCurrentUser(state, action) {
            state.currentUser = action.payload;
        },
        clearCurrentUser(state) {
            state.currentUser = null;
        },
    },
});
export const {setCurrentUser, clearCurrentUser} = authSlice.actions
export default authSlice