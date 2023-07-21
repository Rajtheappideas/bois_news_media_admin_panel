import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, FLUSH, REHYDRATE } from "redux-persist";
import UserSlice from "./UserSlice";
import SubscriberSlice from "./SubscriberSlice";

const rootPersistConfig = {
  key: "root",
  storage,
  blacklist: ["users", "subscribers"],
};

const rootReducer = combineReducers({
  auth: AuthSlice,
  users: UserSlice,
  subscribers: SubscriberSlice,
});

const persisteRoot = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: { root: persisteRoot },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
