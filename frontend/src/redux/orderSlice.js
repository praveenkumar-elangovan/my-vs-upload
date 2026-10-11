
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// Get logged-in user's orders
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      if (!token) {
        return rejectWithValue("Please login first");
      }

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to fetch orders"
        );
      }

      return Array.isArray(data) ? data : data.orders || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Place a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      console.log("Token exists:", Boolean(token));
console.log("API URL:", API_URL);

      if (!token) {
        return rejectWithValue("Please login first");
      }

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to place order"
        );
      }

      return data.order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    clearOrderStatus: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload) {
          state.orders.unshift(action.payload);
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderStatus } = orderSlice.actions;

export default orderSlice.reducer;