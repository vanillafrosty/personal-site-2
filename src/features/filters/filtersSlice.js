import { createSlice } from "@reduxjs/toolkit";

export const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    venue: {
      bars: false,
      restaurants: false,
      marketplaces: false,
      cafes: false,
    },
    price: {
      1: false,
      2: false,
      3: false,
    },
    rating: 3,
  },
  reducers: {
    updateVenue: (state, action) => {
      state.venue[action.payload] = !state.venue[action.payload];
      return state;
    },
    updatePrice: (state, action) => {
      state.price[action.payload] = !state.price[action.payload];
      return state;
    },
    updateRating: (state, action) => {
      state.rating = action.payload;
      return state;
    },
  },
});

export const { updateVenue, updatePrice, updateRating } = filtersSlice.actions;

export default filtersSlice.reducer;
