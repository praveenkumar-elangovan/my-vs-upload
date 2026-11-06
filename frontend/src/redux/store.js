import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import reviewReducer from "./reviewSlice";
import subscriptionReducer from "./subscriptionSlice";
import favoritesReducer from "./favoritesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    reviews: reviewReducer,
    subscription: subscriptionReducer,
    favorites: favoritesReducer,
  },
});

export default store;