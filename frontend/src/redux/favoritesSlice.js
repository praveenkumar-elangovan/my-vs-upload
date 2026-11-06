import { createSlice } from "@reduxjs/toolkit";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch {
    return [];
  }
};

const save = (items) => {
  try {
    localStorage.setItem("favorites", JSON.stringify(items));
  } catch {
    /* ignore storage errors */
  }
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { items: load() },
  reducers: {
    // Heart touch: illana add, irundha remove
    toggleFavorite: (state, action) => {
      const p = action.payload;
      const exists = state.items.some((i) => i._id === p._id);

      if (exists) {
        state.items = state.items.filter((i) => i._id !== p._id);
      } else {
        state.items.push({
          _id: p._id,
          name: p.name,
          price: p.price,
          oldPrice: p.oldPrice,
          image: p.image,
          category: p.category,
          rating: p.rating,
          stock: p.stock,
        });
      }
      save(state.items);
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      save(state.items);
    },
  },
});

export const { toggleFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;