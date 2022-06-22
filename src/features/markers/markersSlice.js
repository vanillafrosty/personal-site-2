import { createSlice } from "@reduxjs/toolkit";

export const markersSlice = createSlice({
  name: "markers",
  initialState: {
    markers: [],
  },
  reducers: {
    updateMarkers: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateMarkers } = markersSlice.actions;

export default markersSlice.reducer;
