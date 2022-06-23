import { createSlice } from "@reduxjs/toolkit";

export const markersSlice = createSlice({
  name: "markers",
  initialState: {
    markers: [],
    zoom: 0,
  },
  reducers: {
    updateMarkers: (state, action) => {
      return action.payload;
    },
    updateZoom: (state, action) => {
      return action.payload;
    },
  },
});

export const { updateMarkers, updateZoom } = markersSlice.actions;

export default markersSlice.reducer;
