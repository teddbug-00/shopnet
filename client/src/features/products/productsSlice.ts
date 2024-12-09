import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Product, ProductFormData } from "../../types/product";

const API_URL = "http://localhost:5000/api/products";

interface ProductsState {
  items: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ProductsState = {
  items: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  success: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch products",
      );
    }
  },
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: ProductFormData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const response = await axios.post(`${API_URL}`, productData, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create product",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (
    { id, productData }: { id: string; productData: Partial<ProductFormData> },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as any;
      const response = await axios.put(`${API_URL}/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update product",
      );
    }
  },
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch product",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${state.auth.token}`,
        },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete product",
      );
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductsState: (state) => {
      state.error = null;
      state.success = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.success = "Product created successfully";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.success = "Product updated successfully";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.success = "Product deleted successfully";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProductsState, setCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
