import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";

const store = configureStore({
  reducer: { user: AuthSlice },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV === "development" ? true : false,
});

export default store;
