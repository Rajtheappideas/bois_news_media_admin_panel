import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetAllSubscription = createAsyncThunk(
  "subscription/handleGetAllSubscription",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("subscription", {
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

export const handleGetSubscriptionById = createAsyncThunk(
  "subscription/handleGetSubscriptionById",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`subscription/${id}`, {
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

export const handleAddNewSubscription = createAsyncThunk(
  "subscription/handleAddNewSubscription",
  async (
    {
      title,
      priceDigital,
      pricePaperEEC,
      pricePaperFrance,
      pricePaperRestOfWorld,
      status,
      description,
      image,
      magazineTitle,
      token,
      signal,
      detailDescription,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("subscription", {
        data: {
          title,
          priceDigital,
          pricePaperEEC,
          pricePaperFrance,
          pricePaperRestOfWorld,
          status,
          description,
          image,
          magazineTitle,
          detailDescription,
        },
        signal: signal.current.signal,
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleEditSubscription = createAsyncThunk(
  "subscription/handleEditSubscription",
  async (
    {
      title,
      priceDigital,
      pricePaperEEC,
      pricePaperRestOfWorld,
      pricePaperFrance,
      status,
      description,
      image,
      magazineTitle,
      id,
      token,
      signal,
      detailDescription,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`subscription/${id}`, {
        data: {
          title,
          priceDigital,
          pricePaperEEC,
          pricePaperRestOfWorld,
          pricePaperFrance,
          status,
          description,
          image,
          magazineTitle,
          detailDescription,
        },
        signal: signal.current.signal,
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleDeletesUBSCRIPTION = createAsyncThunk(
  "subscription/handleDeletesUBSCRIPTION",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`subscription/delete/${id}`, {
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
  error: null,
  success: false,
  subscriptions: [],
  filterType: "newest",
  singleSubscription: null,
  singleSubscriptionLoading: false,
  addNewSubscriptionLoading: false,
  deleteSubscriptionLoading: false,
  editSubscriptionLoading: false,
  deleteSubscriptionID: null,
};

const SubscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    handlerFilterSubscription: (state, { payload }) => {
      state.filterType = payload;
      state.subscriptions = state.subscriptions?.slice().reverse();
    },
    handleFindSubscription: (state, { payload }) => {
      if (payload !== "") {
        const findSubscription = state.subscriptions.find(
          (subscription) => subscription?._id === payload
        );
        if (findSubscription) {
          state.singleSubscription = findSubscription;
        }
      } else {
        state.singleSubscription = null;
      }
    },
    handleDeleteSubscription: (state, { payload }) => {
      const findSubscription = state.subscriptions.filter(
        (subscription) => subscription?._id !== payload
      );
      if (findSubscription) {
        state.subscriptions = findSubscription;
      }
    },
    handleChangeDeleteID: (state, { payload }) => {
      state.deleteSubscriptionID = payload;
    },
    handleChangeSingleSubscription: (state, { payload }) => {
      state.singleSubscription = payload;
    },
  },
  extraReducers: (builder) => {
    // get all payers
    builder.addCase(handleGetAllSubscription.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(
      handleGetAllSubscription.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.subscriptions = payload?.subscription;
        state.error = null;
      }
    );
    builder.addCase(handleGetAllSubscription.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.subscriptions = [];
      state.error = payload ?? null;
    });
    // get subscription by id
    builder.addCase(handleGetSubscriptionById.pending, (state, {}) => {
      state.singleSubscriptionLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(
      handleGetSubscriptionById.fulfilled,
      (state, { payload }) => {
        state.singleSubscriptionLoading = false;
        state.success = true;
        state.singleSubscription = payload?.subscription;
        state.error = null;
      }
    );
    builder.addCase(
      handleGetSubscriptionById.rejected,
      (state, { payload }) => {
        state.singleSubscriptionLoading = false;
        state.success = false;
        state.singleSubscription = null;
        state.error = payload ?? null;
      }
    );
    // add new payer
    builder.addCase(handleAddNewSubscription.pending, (state, {}) => {
      state.addNewSubscriptionLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(
      handleAddNewSubscription.fulfilled,
      (state, { payload }) => {
        state.addNewSubscriptionLoading = false;
        state.success = true;
        state.error = null;
        state.subscriptions = [...state.subscriptions, payload?.subscription];
      }
    );
    builder.addCase(handleAddNewSubscription.rejected, (state, { payload }) => {
      state.addNewSubscriptionLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // edit payer
    builder.addCase(handleEditSubscription.pending, (state, {}) => {
      state.editSubscriptionLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleEditSubscription.fulfilled, (state, { payload }) => {
      state.editSubscriptionLoading = false;
      state.success = true;
      state.error = null;
      state.subscriptions = state.subscriptions.map((subscription) =>
        subscription?._id === payload?.subscription?._id
          ? payload?.subscription
          : subscription
      );
    });
    builder.addCase(handleEditSubscription.rejected, (state, { payload }) => {
      state.editSubscriptionLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // delete payer
    builder.addCase(handleDeletesUBSCRIPTION.pending, (state, {}) => {
      state.deleteSubscriptionLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(
      handleDeletesUBSCRIPTION.fulfilled,
      (state, { payload }) => {
        state.deleteSubscriptionLoading = false;
        state.success = true;
        state.error = null;
        state.deleteSubscriptionID = null;
      }
    );
    builder.addCase(handleDeletesUBSCRIPTION.rejected, (state, { payload }) => {
      state.deleteSubscriptionLoading = false;
      state.success = false;
      state.error = payload ?? null;
      state.deleteSubscriptionID = null;
    });
  },
});

export const {
  handleChangeDeleteID,
  handleDeleteSubscription,
  handleFindSubscription,
  handlerFilterSubscription,
  handleChangeSingleSubscription,
} = SubscriptionSlice.actions;

export default SubscriptionSlice.reducer;
