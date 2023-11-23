import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import toast from "react-hot-toast";

export const handleGetPricing = createAsyncThunk(
  "tax_shipping/handleGetPricing",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("pricing", {
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

export const handleUpadtePricing = createAsyncThunk(
  "tax_shipping/handleUpadtePricing",
  async ({ tax, shipping, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`pricing`, {
        data: {
          tax,
          shipping,
        },
        signal: signal.current.signal,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
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
  error: null,
  updateLoading: false,
  tax: null,
  shipping: null,
};

const TaxAndShippingSlice = createSlice({
  name: "tax_shipping",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get all price
    builder.addCase(handleGetPricing.pending, (state, {}) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleGetPricing.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.tax = payload?.pricing?.tax;
      state.shipping = payload?.pricing?.shipping;
      state.error = null;
    });
    builder.addCase(handleGetPricing.rejected, (state, { payload }) => {
      state.loading = false;
      state.tax = null;
      state.shipping = null;
      state.error = payload ?? null;
    });
    // update price
    builder.addCase(handleUpadtePricing.pending, (state, {}) => {
      state.updateLoading = true;
      state.error = null;
    });
    builder.addCase(handleUpadtePricing.fulfilled, (state, { payload }) => {
      state.updateLoading = false;
      state.tax = payload?.pricing?.tax;
      state.shipping = payload?.pricing?.shipping;
      state.error = null;
    });
    builder.addCase(handleUpadtePricing.rejected, (state, { payload }) => {
      state.updateLoading = false;
      state.tax = null;
      state.shipping = null;
      state.error = payload ?? null;
    });
  },
});

export const {} = TaxAndShippingSlice.actions;

export default TaxAndShippingSlice.reducer;
