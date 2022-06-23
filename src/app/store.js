import { configureStore } from "@reduxjs/toolkit";
import markersReducer from "../features/markers/markersSlice";
import filtersReducer from "../features/filters/filtersSlice";

export default configureStore({
  reducer: {
    markers: markersReducer,
    filters: filtersReducer,
  },
});
