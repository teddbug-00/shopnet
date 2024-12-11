import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "SYSTEM" | "ORDER" | "PRODUCT" | "ACCOUNT";
  read: boolean;
  createdAt: string;
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
    const state = getState() as any;
    const response = await axios.get(
      `${process.env.VITE_API_URL}/notifications`,
      {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      },
    );
    return response.data;
  },
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id: string, { getState }) => {
    const state = getState() as any;
    const response = await axios.put(
      `${process.env.VITE_API_URL}/notifications/${id}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      },
    );
    return response.data;
  },
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { getState }) => {
    const state = getState() as any;
    await axios.put(
      `${process.env.VITE_API_URL}/notifications/mark-all-read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      },
    );
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter(
          (n: Notification) => !n.read,
        ).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch notifications";
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.items.findIndex((n) => n.id === action.payload.id);
        if (index !== -1) {
          state.items[index].read = true;
          state.unreadCount = state.unreadCount - 1;
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach((notification) => {
          notification.read = true;
        });
        state.unreadCount = 0;
      });
  },
});

export default notificationsSlice.reducer;
