import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  AccountSetupData,
  User,
} from "../../types/auth";

const API_URL = "http://localhost:5000/api/users";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/register`,
        credentials,
      );

      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Registration failed",
      );
    }
  },
);

export const updateAccountType = createAsyncThunk(
  "auth/updateAccountType",
  async (data: AccountSetupData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const response = await axios.put<{ user: User }>(
        `${API_URL}/account-type`,
        data,
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        },
      );
      return { user: response.data.user, token: state.auth.token };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Account setup failed",
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/login`,
        credentials,
      );
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    },
    updateUserData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Account Type
    builder
      .addCase(updateAccountType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAccountType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(updateAccountType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateUserData } = authSlice.actions;
export default authSlice.reducer;
