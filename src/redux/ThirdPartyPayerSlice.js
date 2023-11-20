import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetAllPayers = createAsyncThunk(
  "thirdpartypayer/handleGetAllPayers",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("payer", {
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

export const handleGetPayerById = createAsyncThunk(
  "thirdpartypayer/handleGetPayerById",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`payer/${id}`, {
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

export const handleAddNewPayer = createAsyncThunk(
  "thirdpartypayer/handleAddNewPayer",
  async (
    {
      status,
      accountName,
      email,
      mobile,
      accountNumber,
      companyAddress,
      city,
      country,
      zipCode,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("payer", {
        data: {
          status,
          accountName,
          email,
          mobile,
          accountNumber,
          billingAddress: {
            companyAddress,
            city,
            country,
            zipCode,
          },
        },
        signal: signal.current.signal,
        headers: {
          Authorization: token,
          "Content-Type": "Application/json",
        },
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleEditPayer = createAsyncThunk(
  "thirdpartypayer/handleEditPayer",
  async (
    {
      status,
      accountName,
      email,
      mobile,
      accountNumber,
      companyAddress,
      city,
      country,
      zipCode,
      id,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`payer/${id}`, {
        data: {
          status,
          accountName,
          email,
          mobile,
          accountNumber,
          billingAddress: {
            companyAddress,
            city,
            country,
            zipCode,
          },
        },
        signal: signal.current.signal,
        headers: {
          Authorization: token,
          "Content-Type": "Application/json",
        },
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleDeletePAYER = createAsyncThunk(
  "thirdpartypayer/handleDeletePAYER",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`payer/delete/${id}`, {
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
  payers: [],
  filterType: "newest",
  singlePayer: null,
  singlePayerLoading: false,
  addNewPayerLoading: false,
  deletePayerLoading: false,
  editPayerLoading: false,
  deletePayerID: null,
};

const ThirdPartyPayerSlice = createSlice({
  name: "thirdpartypayer",
  initialState,
  reducers: {
    handlerFilterPayers: (state, { payload }) => {
      state.filterType = payload;
      state.payers = state.payers?.slice().reverse();
    },
    handleFindPayer: (state, { payload }) => {
      if (payload !== "") {
        const findPayer = state.payers.find((payer) => payer?._id === payload);
        if (findPayer) {
          state.singlePayer = findPayer;
        }
      } else {
        state.singlePayer = null;
      }
    },
    handleDeletePayer: (state, { payload }) => {
      const findPayer = state.payers.filter((payer) => payer?._id !== payload);
      if (findPayer) {
        state.payers = findPayer;
      }
    },
    handleChangeDeleteID: (state, { payload }) => {
      state.deletePayerID = payload;
    },
    handleChangeSinglePayer: (state, { payload }) => {
      state.singlePayer = payload;
    },
  },
  extraReducers: (builder) => {
    // get all payers
    builder.addCase(handleGetAllPayers.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetAllPayers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.payers = payload?.payer;
      state.error = null;
    });
    builder.addCase(handleGetAllPayers.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.payers = [];
      state.error = payload ?? null;
    });
    // get payer by id
    builder.addCase(handleGetPayerById.pending, (state, {}) => {
      state.singlePayerLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetPayerById.fulfilled, (state, { payload }) => {
      state.singlePayerLoading = false;
      state.success = true;
      state.singlePayer = payload?.payer;
      state.error = null;
    });
    builder.addCase(handleGetPayerById.rejected, (state, { payload }) => {
      state.singlePayerLoading = false;
      state.success = false;
      state.singlePayer = null;
      state.error = payload ?? null;
    });
    // add new payer
    builder.addCase(handleAddNewPayer.pending, (state, {}) => {
      state.addNewPayerLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleAddNewPayer.fulfilled, (state, { payload }) => {
      state.addNewPayerLoading = false;
      state.success = true;
      state.error = null;
      state.payers = [payload?.payer, ...state.payers];
    });
    builder.addCase(handleAddNewPayer.rejected, (state, { payload }) => {
      state.addNewPayerLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // edit payer
    builder.addCase(handleEditPayer.pending, (state, {}) => {
      state.editPayerLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleEditPayer.fulfilled, (state, { payload }) => {
      state.editPayerLoading = false;
      state.success = true;
      state.error = null;
      state.payers = state.payers.map((payer) =>
        payer?._id === payload?.payer?._id ? payload?.payer : payer
      );
    });
    builder.addCase(handleEditPayer.rejected, (state, { payload }) => {
      state.editPayerLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // delete payer
    builder.addCase(handleDeletePAYER.pending, (state, {}) => {
      state.deletePayerLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleDeletePAYER.fulfilled, (state, { payload }) => {
      state.deletePayerLoading = false;
      state.success = true;
      state.error = null;
      state.deletePayerID = null;
    });
    builder.addCase(handleDeletePAYER.rejected, (state, { payload }) => {
      state.deletePayerLoading = false;
      state.success = false;
      state.error = payload ?? null;
      state.deletePayerID = null;
    });
  },
});

export const {
  handleChangeDeleteID,
  handleDeletePayer,
  handleFindPayer,
  handlerFilterPayers,
  handleChangeSinglePayer,
} = ThirdPartyPayerSlice.actions;

export default ThirdPartyPayerSlice.reducer;
