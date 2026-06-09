import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./types";
import Cookies from 'js-cookie'
import { getCurrentUser } from "@/services/auth.service"

interface AuthState {
    user: UserI | null;
    token: string | undefined;
}

interface UserI {
    _id: string;
    username: string;
    email: string;
    role: string;
    image: string;
    name: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}
const initialState: AuthState = {
    user: null,
    token: Cookies.get('token'),
};

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const token = state.auth.token;
            if (!token) return rejectWithValue('No token');
            const user = await getCurrentUser(token);
            return user;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.access_token;
            Cookies.set('token', action.payload.access_token, {
                expires: 1,
                secure: import.meta.env.VITE_NODE_ENV,
                sameSite: 'strict'
            });
        },
        setUser: (state, action) => {

            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = undefined;
            Cookies.remove('token');
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload;
        });
    }
});



export const { setUser, setCredentials, logout } = authSlice.actions;


export const getUser = (state: RootState) => state.auth.user;
export const getAuthToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;