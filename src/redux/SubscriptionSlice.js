import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  subscriptions: [],
  filterType: "newest",
  singleUser: null,
  addNewUserLoading: false,
  deleteUserLoading: false,
  EditUserLoading: false,
  deleteUserID: null,
};

const SubscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
});

export const {} = SubscriptionSlice.actions;

export default SubscriptionSlice.reducer;
