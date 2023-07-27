import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetAllMagazine = createAsyncThunk(
  "magazine/handleGetAllMagazine",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("magazine", {
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

export const handleAddNewMagazine = createAsyncThunk(
  "magazine/handleAddNewMagazine",
  async (
    { title, price, stock, status, description, image, token, signal },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("magazine", {
        data: {
          title,
          price,
          stock,
          status,
          description,
          image,
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

export const handleEditMagazine = createAsyncThunk(
  "magazine/handleEditMagazine",
  async (
    { title, price, stock, status, description, image, id, token, signal },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`magazine/${id}`, {
        data: {
          title,
          price,
          stock,
          status,
          description,
          image,
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

export const handleDeleteMAGAZINE = createAsyncThunk(
  "magazine/handleDeleteMAGAZINE",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`magazine/delete/${id}`, {
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
  magazines: [],
  filterType: "newest",
  singleMagazine: null,
  addNewMagazineLoading: false,
  deleteMagazineLoading: false,
  editMagazineLoading: false,
  deleteMagazineID: null,
};

const MagazineSlice = createSlice({
  name: "magazine",
  initialState,
  reducers: {
    handlerFilterMagazine: (state, { payload }) => {
      state.filterType = payload;
      state.magazines = state.magazines?.slice().reverse();
    },
    handleFindMagazine: (state, { payload }) => {
      if (payload !== "") {
        const findMagazine = state.magazines.find(
          (magazine) => magazine?._id === payload
        );
        if (findMagazine) {
          state.singleMagazine = findMagazine;
        }
      } else {
        state.singleMagazine = null;
      }
    },
    handleDeleteMagazine: (state, { payload }) => {
      const findMagazine = state.magazines.filter(
        (magazine) => magazine?._id !== payload
      );
      if (findMagazine) {
        state.magazines = findMagazine;
      }
    },
    handleChangeDeleteID: (state, { payload }) => {
      state.deleteMagazineID = payload;
    },
  },
  extraReducers: (builder) => {
    // get all payers
    builder.addCase(handleGetAllMagazine.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetAllMagazine.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.magazines = payload?.magazine;
      state.error = null;
    });
    builder.addCase(handleGetAllMagazine.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.magazines = [];
      state.error = payload ?? null;
    });
    // add new payer
    builder.addCase(handleAddNewMagazine.pending, (state, {}) => {
      state.addNewMagazineLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleAddNewMagazine.fulfilled, (state, { payload }) => {
      state.addNewMagazineLoading = false;
      state.success = true;
      state.error = null;
      state.magazines = [...state.magazines, payload?.magazine];
    });
    builder.addCase(handleAddNewMagazine.rejected, (state, { payload }) => {
      state.addNewMagazineLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // edit payer
    builder.addCase(handleEditMagazine.pending, (state, {}) => {
      state.editMagazineLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleEditMagazine.fulfilled, (state, { payload }) => {
      state.editMagazineLoading = false;
      state.success = true;
      state.error = null;
      state.magazines = state.magazines.map((magazine) =>
        magazine?._id === payload?.magazine?._id ? payload?.magazine : magazine
      );
    });
    builder.addCase(handleEditMagazine.rejected, (state, { payload }) => {
      state.editMagazineLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // delete payer
    builder.addCase(handleDeleteMAGAZINE.pending, (state, {}) => {
      state.deleteMagazineLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleDeleteMAGAZINE.fulfilled, (state, { payload }) => {
      state.deleteMagazineLoading = false;
      state.success = true;
      state.error = null;
      state.deleteMagazineID = null;
    });
    builder.addCase(handleDeleteMAGAZINE.rejected, (state, { payload }) => {
      state.deleteMagazineLoading = false;
      state.success = false;
      state.error = payload ?? null;
      state.deleteMagazineID = null;
    });
  },
});

export const {
  handleChangeDeleteID,
  handleDeleteMagazine,
  handleFindMagazine,
  handlerFilterMagazine,
} = MagazineSlice.actions;

export default MagazineSlice.reducer;
