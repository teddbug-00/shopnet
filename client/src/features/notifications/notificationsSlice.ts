import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "SYSTEM" | "ORDER" | "PRODUCT" | "ACCOUNT";
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState }) => {
    try {
      const state = getState() as any;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        },
      );
      return response.data; // This should be an array of notifications
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch notifications",
      );
    }
  },
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id: string, { getState }) => {
    try {
      const state = getState() as any;
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        },
      );
      return { id, ...response.data };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "Failed to mark notification as read",
      );
    }
  },
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { getState }) => {
    try {
      const state = getState() as any;
      await axios.put(
        `${import.meta.env.VITE_API_URL}/notifications/mark-all-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${state.auth.token}`,
          },
        },
      );
      return true;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error ||
          "Failed to mark all notifications as read",
      );
    }
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        console.log("Received payload:", action.payload);
        state.isLoading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        console.log("Processed items:", state.items);
        state.unreadCount = state.items.filter((item) => !item.read).length;
        console.log("Updated state:", state);
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index].read = true;
          state.unreadCount = state.items.filter((item) => !item.read).length;
        }
      })
      // Mark All as Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach((item) => {
          item.read = true;
        });
        state.unreadCount = 0;
      });
  },
});

export default notificationsSlice.reducer;
