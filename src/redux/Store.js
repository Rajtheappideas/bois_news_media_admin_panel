import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore, FLUSH, REHYDRATE } from "redux-persist";
import UserSlice from "./UserSlice";
import SubscriberSlice from "./SubscriberSlice";
import ProspectSlice from "./ProspectSlice";
import MagazineSlice from "./MagazineSlice";
import PartnerSlice from "./PartnerSlice";
import OrderSlice from "./OrderSlice";
import SubscriptionSlice from "./SubscriptionSlice";
import ThirdPartyPayerSlice from "./ThirdPartyPayerSlice";
import GlobalStates from "./GlobalStates";
import TaxAndShippingSlice from "./TaxAndShippingSlice";
import PromoCodeSlice from "./PromoCodeSlice";
<<<<<<< HEAD

const rootPersistConfig = {
  key: "root",
  storage,
  blacklist: [
    "users",
    "subscribers",
    "prospects",
    "magazines",
    "partners",
    "orders",
    "subscriptions",
    "thirdPartyPayers",
    "taxAndShipping",
    "promoCode",
    "auth",
    "globalStates",
  ],
};
=======
import InvoiceSlice from "./InvoiceSlice";
>>>>>>> raj_appideas

const globalStatesPersistConfig = {
  key: "globalStates",
  storage,
  whitelist: ["activeSidebarTab"],
};

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "role", "token", "verifyToken", "email"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, AuthSlice),
  users: UserSlice,
  subscribers: SubscriberSlice,
  prospects: ProspectSlice,
  magazines: MagazineSlice,
  partners: PartnerSlice,
  orders: OrderSlice,
  subscriptions: SubscriptionSlice,
  thirdPartyPayers: ThirdPartyPayerSlice,
  globalStates: persistReducer(globalStatesPersistConfig, GlobalStates),
  taxAndShipping: TaxAndShippingSlice,
  promoCode: PromoCodeSlice,
<<<<<<< HEAD
});

const persisteRoot = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: { root: persisteRoot },
=======
  invoice: InvoiceSlice,
});

// const persisteRoot = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: { root: rootReducer },
>>>>>>> raj_appideas
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
