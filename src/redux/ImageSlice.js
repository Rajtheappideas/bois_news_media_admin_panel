import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { GetUrl, PostUrl } from "../BaseUrl";

export const handleGetImages = createAsyncThunk(
  "image/handleGetImages",
  async ({ token }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await GetUrl("image", {
        headers: { Authorization: token },
      });
      return fulfillWithValue(data);
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error?.response);
    }
  }
);

export const handleGetImageById = createAsyncThunk(
  "image/handelGetImageById",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const { data } = await GetUrl(`image/${id}`, {
        headers: { Authorization: token },
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue;
    }
  }
);

export const handleAddImage = createAsyncThunk(
  "image/handleAddImage",
  async (
    { signal, name, image, encontent, frcontent, url, website, token },
    { rejectWithValue, fulfillWithValue }
  ) => {
    signal.current = new AbortController();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("en[content]", encontent);
      formData.append("fr[content]", frcontent);
      formData.append("url", url);
      formData.append("website", website);
      const { data } = await PostUrl("image", {
        data: formData,
        headers: { Authorization: token },
        signal: signal.current.signal,
      });
      return fulfillWithValue(data);
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error?.response);
    }
  }
);

export const handleEditImage = createAsyncThunk(
  "image/handleEditImage",
  async (
    { signal, name, image, encontent, frcontent, url, website, token, id },
    { rejectWithValue, fulfillWithValue }
  ) => {
    signal.current = new AbortController();
    // const controller = new AbortController();
    // signal.addEventListener("abort", () => {
    //   controller.abort();
    // });
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("en[content]", encontent);
      formData.append("fr[content]", frcontent);
      formData.append("url", url);
      formData.append("website", website);

      const { data } = await PostUrl(`image/${id}`, {
        data: formData,
        signal: signal.current.signal,
        // signal: controller.signal,
        headers: { Authorization: token },
      });
      return fulfillWithValue(data);
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error?.response);
    }
  }
);

export const handleDeleteImage = createAsyncThunk(
  "image/handleDeleteImage",
  async ({ id, token, signal }, { rejectWithValue }) => {
    signal.current = new AbortController();
    try {
      const { data } = await GetUrl(`image/delete/${id}`, {
        headers: { Authorization: token },
        signal: signal.current.signal,
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error?.response);
    }
  }
);

const initialState = {
  loading: false,
  images: [],
  deleteLoading: false,
  addAndEditLoading: false,
  error: null,
  singleImage: null,
};

const ImageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    handleChangesingleImage: (state, { payload }) => {
      state.singleImage = payload;
    },
  },
  extraReducers: (builder) => {
    // get all images
    builder
      .addCase(handleGetImages.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(handleGetImages.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.images = payload?.images;
        state.error = null;
      })
      .addCase(handleGetImages.rejected, (state, { payload }) => {
        state.loading = false;
        state.images = [];
        state.error = payload ?? null;
      });

    // get image by id
    builder
      .addCase(handleGetImageById.pending, (state, { payload }) => {
        state.loading = true;
      })
      .addCase(handleGetImageById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.singleImage = payload?.image;
        state.error = null;
      })
      .addCase(handleGetImageById.rejected, (state, { payload }) => {
        state.loading = false;
        state.singleImage = null;
        state.error = payload ?? null;
      });

    // add image
    builder
      .addCase(handleAddImage.pending, (state, { payload }) => {
        state.addAndEditLoading = true;
      })
      .addCase(handleAddImage.fulfilled, (state, { payload }) => {
        state.addAndEditLoading = false;
        state.images = [payload?.image, ...state.images];
        state.error = null;
      })
      .addCase(handleAddImage.rejected, (state, { payload }) => {
        state.addAndEditLoading = false;
        state.images = state.images;
        state.error = payload ?? null;
      });

    // edit image
    builder
      .addCase(handleEditImage.pending, (state, { payload }) => {
        state.addAndEditLoading = true;
      })
      .addCase(
        handleEditImage.fulfilled,
        (state, { payload, meta: { arg } }) => {
          state.addAndEditLoading = false;
          state.images = state.images.map((image) => {
            if (arg?.id === image?._id) {
              return payload?.image;
            } else {
              return image;
            }
          });
          state.error = null;
        }
      )
      .addCase(handleEditImage.rejected, (state, { payload }) => {
        state.addAndEditLoading = false;
        state.images = state.images;
        state.error = payload ?? null;
      });

    // delete image
    builder
      .addCase(handleDeleteImage.pending, (state, { payload }) => {
        state.deleteLoading = true;
      })
      .addCase(
        handleDeleteImage.fulfilled,
        (state, { payload, meta: { arg } }) => {
          state.deleteLoading = false;
          console.log(arg);
          state.images = state.images.filter((image) => image?._id !== arg?.id);
          state.error = null;
        }
      )
      .addCase(handleDeleteImage.rejected, (state, { payload }) => {
        state.deleteLoading = false;
        state.images = state.images;
        state.error = payload ?? null;
      });
  },
});

export const { handleChangesingleImage } = ImageSlice.actions;

export default ImageSlice.reducer;
