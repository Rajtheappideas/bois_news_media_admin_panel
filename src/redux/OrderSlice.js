import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetAllOrder = createAsyncThunk(
  "order/handleGetAllOrder",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("order", {
        signal: signal.current.signal,
        headers: {
          Authorization: token,
        },
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data);
    }
  },
);

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
  reducers: {
    handleFindSingleOrder: (state, { payload }) => {
      const findOrder = state.orders.find((order) => order?._id === payload);
      if (findOrder) {
        state.singleOrder = findOrder;
      } else {
        state.singleOrder = null;
      }
    },
  },
  extraReducers: (builder) => {
    // get all payers
    builder.addCase(handleGetAllOrder.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetAllOrder.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.orders = payload?.orders;
      state.error = null;
    });
    builder.addCase(handleGetAllOrder.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.magazines = [];
      state.error = payload ?? null;
    });
  },
});

export const { handleFindSingleOrder } = OrderSlice.actions;

export default OrderSlice.reducer;
