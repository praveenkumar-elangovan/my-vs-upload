
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch Reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/products/${productId}/reviews`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }

      return data.reviews || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add Review
export const addReview = createAsyncThunk(
  "reviews/addReview",
  async ({ productId, reviewData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add review");
      }

      return data.review || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Review
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async (
    { productId, reviewId, reviewData, token },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/products/${productId}/reviews/${reviewId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update review");
      }

      return data.review || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete Review
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async ({ productId, reviewId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/products/${productId}/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      return reviewId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Review Slice
const reviewSlice = createSlice({
  name: "reviews",

  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })

      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Review
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })

      // Update Review
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (review) => review._id === action.payload._id
        );

        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })

      // Delete Review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload
        );
      });
  },
});

export default reviewSlice.reducer;
