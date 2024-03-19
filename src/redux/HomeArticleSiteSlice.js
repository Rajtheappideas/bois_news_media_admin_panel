import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { GetUrl, PostUrl } from "../BaseUrl";

export const handleGetHomePageConent = createAsyncThunk(
  "getcontent/handleGetHomePageConent",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await GetUrl("content", {
        headers: { Authorization: token },
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleGetHomePageConentById = createAsyncThunk(
  "getcontent/handleGetHomePageConentById",
  async ({ token, id }, { rejectWithValue }) => {
    try {
      const { data } = await GetUrl(`content/${id}`, {
        headers: { Authorization: token },
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleUpdateHomePageConent = createAsyncThunk(
  "getcontent/handleUpdateHomePageConent",
  async (
    { token, website, heroSection, otherSections, signal },
    { rejectWithValue }
  ) => {
    signal.current = new AbortController()
    try {
      const { data } = await PostUrl("content", {
        data: { website, heroSection, otherSections },
        headers: { Authorization: token },
        signal:signal.current.signal
      });
      return data;
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  homePageLoading: false,
  homePageContent: [],
  homePageContentUpdateLoading: false,
  singleContent: null,
  error: null,
};

const HomeArticleSiteSlice = createSlice({
  name: "homearticlesite",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // get home page content
    builder
      .addCase(handleGetHomePageConent.pending, (state, action) => {
        state.homePageLoading = true;
      })
      .addCase(handleGetHomePageConent.fulfilled, (state, { payload }) => {
        state.homePageLoading = false;
        state.homePageContent = payload?.contents;
        state.error = null;
      })
      .addCase(handleGetHomePageConent.rejected, (state, { payload }) => {
        state.homePageLoading = false;
        state.error = payload;
        state.homePageContent = [];
      });

    // get home page content by id
    builder
      .addCase(handleGetHomePageConentById.pending, (state, action) => {
        state.homePageLoading = true;
      })
      .addCase(handleGetHomePageConentById.fulfilled, (state, { payload }) => {
        state.homePageLoading = false;
        state.singleContent = payload?.content;
        state.error = null;
      })
      .addCase(handleGetHomePageConentById.rejected, (state, { payload }) => {
        state.homePageLoading = false;
        state.error = payload;
        state.singleContent = null;
      });

    // add & update page content
    builder
      .addCase(handleUpdateHomePageConent.pending, (state, action) => {
        state.homePageContentUpdateLoading = true;
      })
      .addCase(handleUpdateHomePageConent.fulfilled, (state, { payload }) => {
        state.homePageContentUpdateLoading = false;
        const findContentInState = state.homePageContent.find(
          (content) => content._id === payload?.content?._id
        );
        if (findContentInState) {
          state.homePageContent = state.homePageContent.map((content) =>
            content?._id === payload?.content?._id ? payload?.content : content
          );
        } else {
          state.homePageContent = [payload?.content, ...state.homePageContent];
        }
        state.error = null;
      })
      .addCase(handleUpdateHomePageConent.rejected, (state, { payload }) => {
        state.homePageContentUpdateLoading = false;
        state.error = payload;
        state.homePageContent = null;
      });
  },
});

export const {} = HomeArticleSiteSlice.actions;

export default HomeArticleSiteSlice.reducer;
