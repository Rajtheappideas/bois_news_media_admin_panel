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

export const handleCreateOrder = createAsyncThunk(
  "order/handleCreateOrder",
  async (
    {
      subscriber,
      items,
      VAT,
      purchaseOrder,
      orderNotes,
      paymentMethod,
      status,
      token,
      signal,
    },
    { rejectWithValue },
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`order/add`, {
        data: {
          subscriber,
          items,
          VAT,
          purchaseOrder,
          orderNotes,
          paymentMethod,
          status,
        },
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

export const handleUpdateOrderStatus = createAsyncThunk(
  "order/handleUpdateOrderStatus",
  async ({ status, id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`order`, {
        data: {
          status,
          id,
        },
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
  updateLoading: false,
  createLoading: false,
  error: null,
  success: false,
  orders: [],
  filterType: "newest",
  singleOrder: null,
};

const OrderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    handlerFilterOrders: (state, { payload }) => {
      state.filterType = payload;
      state.orders = state.orders?.slice().reverse();
    },
    handleFindSingleOrder: (state, { payload }) => {
      const findOrder = state.orders.find((order) => order?._id === payload);
      if (findOrder) {
        state.singleOrder = findOrder;
      } else {
        state.singleOrder = null;
      }
    },
    handleChangeOrderStatus: (state, { payload }) => {
      state.orders = state.orders.map((order) =>
        order?._id === payload?.id
          ? { ...order, status: payload?.status }
          : order,
      );
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
      state.orders = [];
      state.error = payload ?? null;
    });
    // create order
    builder.addCase(handleCreateOrder.pending, (state, {}) => {
      state.createLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleCreateOrder.fulfilled, (state, { payload }) => {
      state.createLoading = false;
      state.success = true;
      state.orders = [payload?.order, ...state.orders];
      state.error = null;
    });
    builder.addCase(handleCreateOrder.rejected, (state, { payload }) => {
      state.createLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // update order status
    builder.addCase(handleUpdateOrderStatus.pending, (state, {}) => {
      state.updateLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleUpdateOrderStatus.fulfilled, (state, { payload }) => {
      state.updateLoading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(handleUpdateOrderStatus.rejected, (state, { payload }) => {
      state.updateLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
  },
});

export const {
  handleFindSingleOrder,
  handlerFilterOrders,
  handleChangeOrderStatus,
} = OrderSlice.actions;

export default OrderSlice.reducer;
