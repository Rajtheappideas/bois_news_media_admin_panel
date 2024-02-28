import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import toast from "react-hot-toast";

export const handleGetAllInvoice = createAsyncThunk(
  "invoice/handleGetAllInvoice",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("invoice", {
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

export const handleGetInvoiceById = createAsyncThunk(
  "invoice/handleGetInvoiceById",
  async ({ token, id, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`invoice/${id}`, {
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

export const handleCreateAndEditInvoice = createAsyncThunk(
  "invoice/handleCreateAndEditInvoice",
  async (
    {
      VAT,
      orderId,
      order,
      subscriberId,
      items,
      companyName,
      purchaseOrder,
      paymentMethod,
      id,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    signal.current = new AbortController();
    if (id) {
      try {
        const response = await PostUrl(`invoice/${id}`, {
          data: {
            VAT,
            companyName,
            purchaseOrder,
            paymentMethod,
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
    } else {
      try {
        const response = await PostUrl(`invoice/add`, {
          data: {
            VAT,
            companyName,
            purchaseOrder,
            paymentMethod,
            order,
            orderId,
            subscriber: subscriberId,
            items,
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
    }
  }
);

const initialState = {
  loading: false,
  invoices: [],
  singleInvoice: null,
  updateLoading: false,
  error: null,
};

const InvoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    handleFindInvoice: (state, { payload }) => {
      const invoice = state.invoices.find(
        (invoice) => invoice?._id === payload
      );
      if (invoice) {
        state.singleInvoice = invoice;
      } else {
        state.singleInvoice = null;
      }
    },
  },
  extraReducers: (builder) => {
    // get all invoices
    builder.addCase(handleGetAllInvoice.pending, (state, {}) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleGetAllInvoice.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.invoices = payload?.invoices;
      state.error = null;
    });
    builder.addCase(handleGetAllInvoice.rejected, (state, { payload }) => {
      state.loading = false;
      state.invoices = [];
      state.error = payload ?? null;
    });

    // get invoice by id
    builder.addCase(handleGetInvoiceById.pending, (state, {}) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(handleGetInvoiceById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.singleInvoice = payload?.invoice;
      state.error = null;
    });
    builder.addCase(handleGetInvoiceById.rejected, (state, { payload }) => {
      state.loading = false;
      state.singleInvoice = null;
      state.error = payload ?? null;
    });

    // get add or edit invoice
    builder.addCase(handleCreateAndEditInvoice.pending, (state, {}) => {
      state.updateLoading = true;
      state.error = null;
    });
    builder.addCase(
      handleCreateAndEditInvoice.fulfilled,
      (state, { payload, meta }) => {
        state.updateLoading = false;
        if (!meta?.arg?.hasOwnProperty("id")) {
          state.invoices = [payload?.invoice, ...state.invoices];
        }
        state.error = null;
      }
    );
    builder.addCase(
      handleCreateAndEditInvoice.rejected,
      (state, { payload }) => {
        state.updateLoading = false;
        state.error = payload ?? null;
      }
    );
  },
});

export const { handleFindInvoice } = InvoiceSlice.actions;

export default InvoiceSlice.reducer;
