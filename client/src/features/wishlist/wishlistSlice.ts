import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product } from "../../types/product";

interface WishlistState {
  items: string[]; // Array of product IDs
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId: string, { rejectWithValue }) => {
    try {
      // For now, we'll just return the ID since we don't have the backend endpoint
      // const response = await axios.post(`/api/wishlist`, { productId });
      // return response.data;
      return productId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to add to wishlist",
      );
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId: string, { rejectWithValue }) => {
    try {
      // For now, we'll just return the ID since we don't have the backend endpoint
      // await axios.delete(`/api/wishlist/${productId}`);
      return productId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to remove from wishlist",
      );
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        if (!state.items.includes(action.payload)) {
          state.items.push(action.payload);
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((id) => id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
