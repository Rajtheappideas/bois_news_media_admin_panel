import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import toast from "react-hot-toast";

export const handleGetAllPromoCodes = createAsyncThunk(
  "promoCode/handleGetAllPromoCodes",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("promo", {
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

export const handleCreatePromoCode = createAsyncThunk(
  "magazine/handleCreatePromoCode",
  async (
    {
      code,
      discountPercentage,
      expireDate,
      subscription,
      maxUsage,
      totalMaxUsage,
      subscribers,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();

      const response = await PostUrl("promo", {
        data: {
          code,
          discountPercentage,
          expireDate,
          maxUsage,
          totalMaxUsage,
          subscription,
          subscribers,
        },
        headers: { Authorization: token },
        signal: signal.current.signal,
      });
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleEditPromoCode = createAsyncThunk(
  "promoCode/handleEditPromoCode",
  async (
    {
      code,
      id,
      discountPercentage,
      expireDate,
      maxUsage,
      totalMaxUsage,
      subscription,
      subscribers,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`promo/${id}`, {
        data: {
          code,
          discountPercentage,
          expireDate,
          maxUsage,
          totalMaxUsage,
          subscription,
          subscribers,
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
);

export const handleDeletePromoCode = createAsyncThunk(
  "promoCode/handleDeletePromoCode",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`promo/delete/${id}`, {
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
  error: null,
  loading: false,
  promoCodes: [],
  singlePromoCode: null,
  createAndUpdateLoading: false,
  deleteLoading: false,
  deletePromoCodeId: null,
};

const PromoCodeSlice = createSlice({
  name: "promoCode",
  initialState,
  reducers: {
    handleFindSinglePromoCode: (state, { payload }) => {
      const findPromo = state.promoCodes.find(
        (promo) => promo?._id === payload
      );
      if (findPromo) {
        state.singlePromoCode = findPromo;
      } else {
        state.singlePromoCode = null;
      }
    },

    handleDeletePromoCodeAction: (state, { payload }) => {
      if (payload) {
        state.promoCodes = state.promoCodes.filter(
          (promo) => promo?._id !== payload
        );
      }
    },
    handleChangeDeleteID: (state, { payload }) => {
      state.deletePromoCodeId = payload;
    },
  },
  extraReducers: (builder) => {
    // get all promo
    builder.addCase(handleGetAllPromoCodes.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetAllPromoCodes.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.promoCodes = payload?.promoCodes;
      state.error = null;
    });
    builder.addCase(handleGetAllPromoCodes.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.promoCodes = [];
      state.error = payload ?? null;
    });

    // create promo code
    builder.addCase(handleCreatePromoCode.pending, (state, {}) => {
      state.createAndUpdateLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleCreatePromoCode.fulfilled, (state, { payload }) => {
      state.createAndUpdateLoading = false;
      state.success = true;
      state.promoCodes = [...state.promoCodes, payload?.promoCode];
      state.error = null;
    });
    builder.addCase(handleCreatePromoCode.rejected, (state, { payload }) => {
      state.createAndUpdateLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });

    // edit promo code
    builder.addCase(handleEditPromoCode.pending, (state, {}) => {
      state.createAndUpdateLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleEditPromoCode.fulfilled, (state, { payload }) => {
      state.createAndUpdateLoading = false;
      state.success = true;
      state.promoCodes = state.promoCodes.map((promo) =>
        promo?._id === payload?.promoCode?._id ? payload?.promoCode : promo
      );
      state.error = null;
    });
    builder.addCase(handleEditPromoCode.rejected, (state, { payload }) => {
      state.createAndUpdateLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });

    // delete promo code
    builder.addCase(handleDeletePromoCode.pending, (state, {}) => {
      state.deleteLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleDeletePromoCode.fulfilled, (state, { payload }) => {
      state.deleteLoading = false;
      state.success = true;
      state.error = null;
    });
    builder.addCase(handleDeletePromoCode.rejected, (state, { payload }) => {
      state.deleteLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
  },
});

export const {
  handleDeletePromoCodeAction,
  handleFindSinglePromoCode,
  handleChangeDeleteID,
} = PromoCodeSlice.actions;

export default PromoCodeSlice.reducer;
