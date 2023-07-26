import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  orders: [],
  filterType: "newest",
  singleUser: null,
  addNewUserLoading: false,
  deleteUserLoading: false,
  EditUserLoading: false,
  deleteUserID: null,
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
});

export const {} = OrderSlice.actions;

export default OrderSlice.reducer;
