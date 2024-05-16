// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import graphicReducer from "./reducers";

const store = configureStore({
  reducer: graphicReducer,
});

export default store;
