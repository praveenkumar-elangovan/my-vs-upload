import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
   addToCart: (state, action) => {
  const product = action.payload;

  const existingProduct = state.items.find(
    (item) => item._id === product._id
  );

  // Product already in cart: do nothing
  if (!existingProduct) {
    state.items.push({
      ...product,
      quantity: 1,
    });
  }
},

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );
    },

    increaseQuantity: (state, action) => {
      const product = state.items.find(
        (item) => item._id === action.payload
      );

      if (product) {
        product.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const product = state.items.find(
        (item) => item._id === action.payload
      );

      if (product && product.quantity > 1) {
        product.quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;