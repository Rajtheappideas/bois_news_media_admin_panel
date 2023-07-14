import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";

const store = configureStore({
  reducer: { user: AuthSlice },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: false,
});

export default store;
