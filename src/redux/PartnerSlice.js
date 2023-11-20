import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetAllPartners = createAsyncThunk(
  "partner/handleGetAllPartners",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("partner", {
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

export const handleGetPartnerById = createAsyncThunk(
  "partner/handleGetPartnerById",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`partner/${id}`, {
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

export const handleAddNewPartner = createAsyncThunk(
  "partner/handleAddNewPartner",
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
      const response = await PostUrl("partner", {
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
            city,
            country,
            province,
            zipCode,
            address1,
            address2,
            address3,
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

export const handleEditPartner = createAsyncThunk(
  "partner/handleEditPartner",
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
      const response = await PostUrl(`partner/${id}`, {
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
            city,
            country,
            province,
            zipCode,
            address1,
            address2,
            address3,
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

export const handleDeletePARTNER = createAsyncThunk(
  "partner/handleDeletePARTNER",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`partner/delete/${id}`, {
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
  partners: [],
  filterType: "newest",
  singlePartner: null,
  singlePartnerLoading: false,
  addNewPartnerLoading: false,
  deletePartnerLoading: false,
  editPartnerLoading: false,
  deletePartnerID: null,
};

const PartnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    handlerFilterPartners: (state, { payload }) => {
      state.filterType = payload;
      state.partners = state.partners?.slice().reverse();
    },
    handleFindPartner: (state, { payload }) => {
      if (payload !== "") {
        const findPartner = state.partners.find(
          (partner) => partner?._id === payload
        );
        if (findPartner) {
          state.singlePartner = findPartner;
        }
      } else {
        state.singlePartner = null;
      }
    },
    handleDeletePartner: (state, { payload }) => {
      const findPartner = state.partners.filter(
        (partner) => partner?._id !== payload
      );
      if (findPartner) {
        state.partners = findPartner;
      }
    },
    handleChangeDeleteID: (state, { payload }) => {
      state.deletePartnerID = payload;
    },
    handleChangeSinglePartner: (state, { payload }) => {
      state.singlePartner = payload;
    },
  },
  extraReducers: (builder) => {
    // get all partners
    builder.addCase(handleGetAllPartners.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetAllPartners.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.partners = payload?.partner;
      state.error = null;
    });
    builder.addCase(handleGetAllPartners.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.partners = [];
      state.error = payload ?? null;
    });
    // get partner by id
    builder.addCase(handleGetPartnerById.pending, (state, {}) => {
      state.singlePartnerLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetPartnerById.fulfilled, (state, { payload }) => {
      state.singlePartnerLoading = false;
      state.success = true;
      state.singlePartner = payload?.partner;
      state.error = null;
    });
    builder.addCase(handleGetPartnerById.rejected, (state, { payload }) => {
      state.singlePartnerLoading = false;
      state.success = false;
      state.singlePartner = null;
      state.error = payload ?? null;
    });
    // add new prospect
    builder.addCase(handleAddNewPartner.pending, (state, {}) => {
      state.addNewPartnerLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleAddNewPartner.fulfilled, (state, { payload }) => {
      state.addNewPartnerLoading = false;
      state.success = true;
      state.error = null;
      state.partners = [payload?.partner, ...state.partners];
    });
    builder.addCase(handleAddNewPartner.rejected, (state, { payload }) => {
      state.addNewPartnerLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // edit prospect
    builder.addCase(handleEditPartner.pending, (state, {}) => {
      state.editPartnerLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleEditPartner.fulfilled, (state, { payload }) => {
      state.editPartnerLoading = false;
      state.success = true;
      state.error = null;
      state.partners = state.partners.map((partner) =>
        partner?._id === payload?.partner?._id ? payload?.partner : partner
      );
    });
    builder.addCase(handleEditPartner.rejected, (state, { payload }) => {
      state.editPartnerLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // delete prospect
    builder.addCase(handleDeletePARTNER.pending, (state, {}) => {
      state.deletePartnerLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleDeletePARTNER.fulfilled, (state, { payload }) => {
      state.deletePartnerLoading = false;
      state.success = true;
      state.error = null;
      state.deletePartnerID = null;
    });
    builder.addCase(handleDeletePARTNER.rejected, (state, { payload }) => {
      state.deletePartnerLoading = false;
      state.success = false;
      state.error = payload ?? null;
      state.deletePartnerID = null;
    });
  },
});

export const {
  handleChangeDeleteID,
  handleDeletePartner,
  handleFindPartner,
  handlerFilterPartners,handleChangeSinglePartner
} = PartnerSlice.actions;

export default PartnerSlice.reducer;
