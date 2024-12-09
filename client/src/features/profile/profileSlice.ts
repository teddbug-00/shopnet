import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData: any, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const response = await axios.put(`${API_URL}/profile`, profileData, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update profile",
      );
    }
  },
);

interface ProfileState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ProfileState = {
  isLoading: false,
  error: null,
  success: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.isLoading = false;
        state.success = "Profile updated successfully";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
