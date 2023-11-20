import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetAllProspects = createAsyncThunk(
  "prospect/handleGetAllProspects",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("prospect", {
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

export const handleGetProspectById = createAsyncThunk(
  "prospect/handleGetProspectById",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`prospect/${id}`, {
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

export const handleAddNewProspect = createAsyncThunk(
  "prospect/handleAddNewProspect",
  async (
    {
      fname,
      lname,
      industry,
      website,
      email,
      mobile,
      officeNumber,
      city,
      country,
      company,
      civility,
      province,
      zipCode,
      address1,
      address2,
      address3,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("prospect", {
        data: {
          fname,
          lname,
          industry,
          website,
          email,
          mobile,
          officeNumber,
          civility,
          company,
          shippingAddress: {
            address1,
            address2,
            address3,
            city,
            country,
            zipCode,
            province,
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

export const handleEditProspect = createAsyncThunk(
  "prospect/handleEditProspect",
  async (
    {
      fname,
      lname,
      industry,
      website,
      email,
      mobile,
      officeNumber,
      city,
      country,
      company,
      civility,
      province,
      zipCode,
      address1,
      address2,
      address3,
      id,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`prospect/${id}`, {
        data: {
          fname,
          lname,
          industry,
          website,
          email,
          mobile,
          officeNumber,
          company,
          civility,
          shippingAddress: {
            province,
            zipCode,
            address1,
            address2,
            address3,
            city,
            country,
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

export const handleDeletePROSPECT = createAsyncThunk(
  "prospect/handleDeletePROSPECT",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`prospect/delete/${id}`, {
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
  prospects: [],
  filterType: "newest",
  singleProspect: null,
  singleProspectLoading: false,
  addNewProspectLoading: false,
  deleteProspectLoading: false,
  EditProspectLoading: false,
  deleteProspectID: null,
};

const ProspectSlice = createSlice({
  name: "prospect",
  initialState,
  reducers: {
    handlerFilterProspects: (state, { payload }) => {
      state.filterType = payload;
      state.prospects = state.prospects?.slice().reverse();
    },
    handleFindProspect: (state, { payload }) => {
      if (payload !== "") {
        const findProspect = state.prospects.find(
          (prospect) => prospect?._id === payload
        );
        if (findProspect) {
          state.singleProspect = findProspect;
        }
      } else {
        state.singleProspect = null;
      }
    },
    handleDeleteProspect: (state, { payload }) => {
      const findProspect = state.prospects.filter(
        (prospect) => prospect?._id !== payload
      );
      if (findProspect) {
        state.prospects = findProspect;
      }
    },
    handleChangeDeleteID: (state, { payload }) => {
      state.deleteProspectID = payload;
    },

    handleChangeSingleProspect: (state, { payload }) => {
      state.singleProspect = payload;
    },
  },
  extraReducers: (builder) => {
    // get all users
    builder.addCase(handleGetAllProspects.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetAllProspects.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.prospects = payload?.prospect;
      state.error = null;
    });
    builder.addCase(handleGetAllProspects.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.prospects = [];
      state.error = payload ?? null;
    });
    // get prospect by id
    builder.addCase(handleGetProspectById.pending, (state, {}) => {
      state.singleProspectLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetProspectById.fulfilled, (state, { payload }) => {
      state.singleProspectLoading = false;
      state.success = true;
      state.singleProspect = payload?.prospect;
      state.error = null;
    });
    builder.addCase(handleGetProspectById.rejected, (state, { payload }) => {
      state.singleProspectLoading = false;
      state.success = false;
      state.singleProspect = null;
      state.error = payload ?? null;
    });
    // add new prospect
    builder.addCase(handleAddNewProspect.pending, (state, {}) => {
      state.addNewProspectLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleAddNewProspect.fulfilled, (state, { payload }) => {
      state.addNewProspectLoading = false;
      state.success = true;
      state.error = null;
      state.prospects = [payload?.prospect, ...state.prospects];
    });
    builder.addCase(handleAddNewProspect.rejected, (state, { payload }) => {
      state.addNewProspectLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // edit prospect
    builder.addCase(handleEditProspect.pending, (state, {}) => {
      state.EditProspectLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleEditProspect.fulfilled, (state, { payload }) => {
      state.EditProspectLoading = false;
      state.success = true;
      state.error = null;
      state.prospects = state.prospects.map((prospect) =>
        prospect?._id === payload?.prospect?._id ? payload?.prospect : prospect
      );
    });
    builder.addCase(handleEditProspect.rejected, (state, { payload }) => {
      state.EditProspectLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // delete prospect
    builder.addCase(handleDeletePROSPECT.pending, (state, {}) => {
      state.deleteProspectLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleDeletePROSPECT.fulfilled, (state, { payload }) => {
      state.deleteProspectLoading = false;
      state.success = true;
      state.error = null;
      state.deleteProspectID = null;
    });
    builder.addCase(handleDeletePROSPECT.rejected, (state, { payload }) => {
      state.deleteProspectLoading = false;
      state.success = false;
      state.error = payload ?? null;
      state.deleteProspectID = null;
    });
  },
});

export const {
  handleChangeDeleteID,
  handleDeleteProspect,
  handleFindProspect,
  handlerFilterProspects,
  handleChangeSingleProspect,
} = ProspectSlice.actions;

export default ProspectSlice.reducer;
