import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { GetUrl, PostUrl } from "../BaseUrl";

export const handleGetCategories = createAsyncThunk(
  "categoryandtag/handleGetCategories",
  async ({ token, lang }, { rejectWithValue }) => {
    try {
      const { data } = await GetUrl("category", {
        headers: { Authorization: token, "Accept-Language": lang },
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const handleGetCategoryById = createAsyncThunk(
  "categoryandtag/handleGetCategoryById",
  async ({ token, lang, id }, { rejectWithValue }) => {
    try {
      const { data } = await GetUrl(`category/${id}`, {
        headers: { Authorization: token, "Accept-Language": lang },
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const handleAddCategory = createAsyncThunk(
  "categoryandtag/handleAddCategory",
  async (
    { token, lang, frname, enname, image, website, signal },
    { rejectWithValue }
  ) => {
    signal.current = new AbortController();
    const formData = new FormData();
    formData.append("en[name]", enname);
    formData.append("fr[name]", frname);
    formData.append("image", image);
    formData.append("website", website);
    try {
      const { data } = await PostUrl("category", {
        data: formData,
        headers: {
          Authorization: token,
          "Accept-Language": lang,
          "Content-Type": "multipart/form-data",
        },
        signal: signal.current.signal,
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const handleEditCategory = createAsyncThunk(
  "categoryandtag/handleEditCategory",
  async (
    {
      token,
      lang,
      showOnNavbar,
      showOnHomePage,
      frname,
      enname,
      id,
      image,
      website,
      signal,
    },
    { rejectWithValue }
  ) => {
    signal.current = new AbortController();
    const formData = new FormData();
    formData.append("en[name]", enname);
    formData.append("fr[name]", frname);
    formData.append("image", image);
    formData.append("website", website);
    formData.append("showOnNavbar", showOnNavbar);
    formData.append("showOnHomePage", showOnHomePage);
    try {
      const { data } = await PostUrl(`category/${id}`, {
        data: formData,
        headers: {
          Authorization: token,
          "Accept-Language": lang,
          "Content-Type": "multipart/form-data",
        },
        signal: signal.current.signal,
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const handleDeleteCategory = createAsyncThunk(
  "categoryandtag/handleDeleteCategory",
  async ({ token, lang, id, signal }, { rejectWithValue }) => {
    signal.current = new AbortController();
    try {
      const { data } = await GetUrl(`category/delete/${id}`, {
        headers: {
          Authorization: token,
          "Accept-Language": lang,
          "Content-Type": "multipart/form-data",
        },
        signal: signal.current.signal,
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const handleGetTags = createAsyncThunk(
  "categoryandtag/handleGetTags",
  async ({ token, lang }, { rejectWithValue }) => {
    try {
      const { data } = await GetUrl("tag", {
        headers: { Authorization: token, "Accept-Language": lang },
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const handleGetTagById = createAsyncThunk(
  "categoryandtag/handleGetTagById",
  async ({ token, lang, id }, { rejectWithValue }) => {
    try {
      const { data } = await GetUrl(`tag/${id}`, {
        headers: { Authorization: token, "Accept-Language": lang },
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const handleAddTag = createAsyncThunk(
  "categoryandtag/handleAddTag",
  async ({ token, lang, name, website, signal }, { rejectWithValue }) => {
    signal.current = new AbortController();
    try {
      const { data } = await PostUrl("tag", {
        data: { name, website },
        headers: { Authorization: token, "Accept-Language": lang },
        signal: signal.current.signal,
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const handleEditTag = createAsyncThunk(
  "categoryandtag/handleEditTag",
  async ({ token, lang, id, name, website, signal }, { rejectWithValue }) => {
    signal.current = new AbortController();
    try {
      const { data } = await PostUrl(`tag/${id}`, {
        data: { name, website },
        headers: { Authorization: token, "Accept-Language": lang },
        signal: signal.current.signal,
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

export const handleDeleteTag = createAsyncThunk(
  "categoryandtag/handleDeleteTag",
  async ({ token, id, signal }, { rejectWithValue }) => {
    signal.current = new AbortController();
    try {
      const { data } = await GetUrl(`tag/delete/${id}`, {
        headers: { Authorization: token },
        signal: signal.current.signal,
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  categoryLoading: false,
  categories: [],
  categoryAddAndEditLoading: false,
  categoryRemoveLoading: false,
  singleCategory: null,
  tagLoading: false,
  tagAddAndEditLoading: false,
  tagRemoveLoading: false,
  singelTag: null,
  tags: [],
  error: null,
};

const CategoryAndTagsSlice = createSlice({
  name: "categoryandtag",
  initialState,
  reducers: {
    handleChangeSingleCategory: (state, { payload }) => {
      state.singleCategory = payload;
    },
    handleChangeSingleTag: (state, { payload }) => {
      state.singelTag = payload;
    },
  },
  extraReducers: (buidler) => {
    // get all categories
    buidler
      .addCase(handleGetCategories.pending, (state) => {
        state.categoryLoading = true;
      })
      .addCase(handleGetCategories.fulfilled, (state, { payload }) => {
        state.categoryLoading = false;
        state.categories = payload?.categories;
        state.error = null;
      })
      .addCase(handleGetCategories.rejected, (state, { payload }) => {
        state.categoryLoading = false;
        state.categories = [];
        state.error = payload ?? null;
      });

    // get by id category
    buidler
      .addCase(handleGetCategoryById.pending, (state) => {
        state.categoryLoading = true;
      })
      .addCase(handleGetCategoryById.fulfilled, (state, { payload }) => {
        state.categoryLoading = false;
        state.singleCategory = payload?.category;
        state.error = null;
      })
      .addCase(handleGetCategoryById.rejected, (state, { payload }) => {
        state.categoryLoading = false;
        state.singleCategory = null;
        state.error = payload ?? null;
      });

    // add category
    buidler
      .addCase(handleAddCategory.pending, (state) => {
        state.categoryAddAndEditLoading = true;
      })
      .addCase(handleAddCategory.fulfilled, (state, { payload }) => {
        state.categoryAddAndEditLoading = false;
        state.categories = [payload?.category, ...state?.categories];
        state.error = null;
      })
      .addCase(handleAddCategory.rejected, (state, { payload }) => {
        state.categoryAddAndEditLoading = false;
        state.error = payload ?? null;
      });

    // edit category
    buidler
      .addCase(handleEditCategory.pending, (state) => {
        state.categoryAddAndEditLoading = true;
      })
      .addCase(handleEditCategory.fulfilled, (state, { payload, meta }) => {
        state.categoryAddAndEditLoading = false;
        state.categories = state.categories.map((category) => {
          if (category?._id === meta.arg.id) {
            return payload?.category;
          } else {
            return category;
          }
        });
        state.error = null;
      })
      .addCase(handleEditCategory.rejected, (state, { payload }) => {
        state.categoryAddAndEditLoading = false;
        state.error = payload ?? null;
      });

    // delete category
    buidler
      .addCase(handleDeleteCategory.pending, (state) => {
        state.categoryRemoveLoading = true;
      })
      .addCase(handleDeleteCategory.fulfilled, (state, { payload, meta }) => {
        state.categoryRemoveLoading = false;
        state.categories = state.categories.filter((category) => {
          return category?._id !== meta.arg.id;
        });
        state.error = null;
      })
      .addCase(handleDeleteCategory.rejected, (state, { payload }) => {
        state.categoryRemoveLoading = false;
        state.error = payload ?? null;
      });

    // get all tags
    buidler
      .addCase(handleGetTags.pending, (state) => {
        state.tagLoading = true;
      })
      .addCase(handleGetTags.fulfilled, (state, { payload }) => {
        state.tagLoading = false;
        state.tags = payload?.tags;
        state.error = null;
      })
      .addCase(handleGetTags.rejected, (state, { payload }) => {
        state.tagLoading = false;
        state.tags = [];
        state.error = payload ?? null;
      });

    // get by id tag
    buidler
      .addCase(handleGetTagById.pending, (state) => {
        state.tagLoading = true;
      })
      .addCase(handleGetTagById.fulfilled, (state, { payload }) => {
        state.tagLoading = false;
        state.singelTag = payload?.tag;
        state.error = null;
      })
      .addCase(handleGetTagById.rejected, (state, { payload }) => {
        state.tagLoading = false;
        state.singelTag = null;
        state.error = payload ?? null;
      });

    // add tag
    buidler
      .addCase(handleAddTag.pending, (state) => {
        state.tagAddAndEditLoading = true;
      })
      .addCase(handleAddTag.fulfilled, (state, { payload }) => {
        state.tagAddAndEditLoading = false;
        state.tags = [payload?.tag, ...state.tags];
        state.error = null;
      })
      .addCase(handleAddTag.rejected, (state, { payload }) => {
        state.tagAddAndEditLoading = false;
        state.error = payload ?? null;
      });

    // edit tag
    buidler
      .addCase(handleEditTag.pending, (state) => {
        state.tagAddAndEditLoading = true;
      })
      .addCase(handleEditTag.fulfilled, (state, { payload, meta }) => {
        state.tagAddAndEditLoading = false;
        state.tags = state.tags.map((tag) => {
          if (tag?._id === meta.arg.id) {
            return payload?.tag;
          } else {
            return tag;
          }
        });
        state.error = null;
      })
      .addCase(handleEditTag.rejected, (state, { payload }) => {
        state.tagAddAndEditLoading = false;
        state.error = payload ?? null;
      });

    // delete tag
    buidler
      .addCase(handleDeleteTag.pending, (state) => {
        state.tagRemoveLoading = true;
      })
      .addCase(handleDeleteTag.fulfilled, (state, { payload, meta }) => {
        state.tagRemoveLoading = false;
        state.tags = state.tags.filter((tag) => {
          return tag?._id !== meta.arg.id;
        });
        state.error = null;
      })
      .addCase(handleDeleteTag.rejected, (state, { payload }) => {
        state.tagRemoveLoading = false;
        state.error = payload ?? null;
      });
  },
});

export const { handleChangeSingleCategory, handleChangeSingleTag } =
  CategoryAndTagsSlice.actions;

export default CategoryAndTagsSlice.reducer;
