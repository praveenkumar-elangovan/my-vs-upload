import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:9000/api/subscription";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Page load / login apram status check
export const fetchSubscriptionStatus = createAsyncThunk(
  "subscription/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API}/status`, authHeader());
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load status"
      );
    }
  }
);

// Create order -> Razorpay popup -> verify
export const subscribePlan = createAsyncThunk(
  "subscription/subscribe",
  async (plan, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API}/create-order`,
        { plan },
        authHeader()
      );

      const verified = await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: data.key,
          amount: data.order.amount,
          currency: "INR",
          name: "ShopEase",
          description: `${plan} Premium Plan`,
          order_id: data.order.id,
          handler: async (response) => {
            try {
              const res = await axios.post(
                `${API}/verify`,
                response,
                authHeader()
              );
              resolve(res.data);
            } catch (e) {
              reject(e);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
          theme: { color: "#2563eb" },
        });
        rzp.open();
      });

      return { plan: verified.plan, expiry: verified.expiryDate };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  isPremium: false,
  plan: null,
  expiry: null,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscription: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionStatus.fulfilled, (state, { payload }) => {
        state.isPremium = payload.isPremium;
        state.plan = payload.plan;
        state.expiry = payload.expiry;
      })
      .addCase(subscribePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribePlan.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isPremium = true;
        state.plan = payload.plan;
        state.expiry = payload.expiry;
      })
      .addCase(subscribePlan.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;