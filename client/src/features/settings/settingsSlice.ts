import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/settings";

export const updateProfile = createAsyncThunk(
  "settings/updateProfile",
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

export const changePassword = createAsyncThunk(
  "settings/changePassword",
  async (passwordData: any, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const response = await axios.put(`${API_URL}/password`, passwordData, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to change password",
      );
    }
  },
);

export const updateNotificationPreferences = createAsyncThunk(
  "settings/updateNotifications",
  async (notificationData: any, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { token: string } };
      const response = await axios.put(
        `${API_URL}/notifications`,
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update notifications",
      );
    }
  },
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    isLoading: false,
    error: null as string | null,
    success: null as string | null,
  },
  reducers: {
    clearSettingsState: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
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
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = "Password changed successfully";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Notifications
      .addCase(updateNotificationPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateNotificationPreferences.fulfilled, (state) => {
        state.isLoading = false;
        state.success = "Notification preferences updated successfully";
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;
