import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetAllSubscribers = createAsyncThunk(
  "user/handleGetAllSubscribers",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("subscriber", {
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
  }
);

const initialState = {
  loading: false,
  success: false,
  error: null,
  subscribers: [],
};

const SubscriberSlice = createSlice({
  name: "subscirbers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all subscribers
    builder.addCase(handleGetAllSubscribers.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetAllSubscribers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.subscribers = payload?.subscriber;
      state.error = null;
    });
    builder.addCase(handleGetAllSubscribers.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.subscribers = [];
      state.error = payload ?? null;
    });
  },
});

export const {} = SubscriberSlice.actions;

export default SubscriberSlice.reducer;
