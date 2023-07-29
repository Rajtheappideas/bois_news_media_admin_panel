import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  orders: [],
  filterType: "newest",
  singleOrder: null,
  addNewOrderLoading: false,
  deleteOrderLoading: false,
  EditOrderLoading: false,
  deleteOrderID: null,
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
});

export const {} = OrderSlice.actions;

export default OrderSlice.reducer;
