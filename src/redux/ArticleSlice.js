import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { GetUrl, PostUrl } from "../BaseUrl";

export const handleGetArticles = createAsyncThunk(
  "article/handleGetArticles",
  async ({ token, lang }, { rejectWithValue }) => {
    try {
      const { data } = await GetUrl("article", {
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

export const handleGetArticleById = createAsyncThunk(
  "article/handleGetArticleById",
  async ({ token, lang, id }, { rejectWithValue }) => {
    try {
      const { data } = await GetUrl(`article/${id}`, {
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

export const handleAddArticle = createAsyncThunk(
  "article/handleAddArticle",
  async (
    {
      token,
      lang,
      frtitle,
      frcontent,
      entitle,
      encontent,
      image,
      paid,
      website,
      category,
      tags,
      signal,
    },
    { rejectWithValue }
  ) => {
    const formData = new FormData();
    formData.append("en[title]", entitle);
    formData.append("en[content]", encontent);
    formData.append("fr[title]", frtitle);
    formData.append("fr[content]", frcontent);
    formData.append("image", image);
    formData.append("website", website);
    formData.append("paid", paid);
    formData.append("category", category);
    for (const key in tags) {
      formData.append("tags", tags[key]);
    }
    signal.current = new AbortController();
    try {
      const { data } = await PostUrl("article", {
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

export const handleEditArticle = createAsyncThunk(
  "article/handleEditArticle",
  async (
    {
      token,
      lang,
      frtitle,
      frcontent,
      entitle,
      encontent,
      image,
      paid,
      website,
      category,
      id,
      tags,
      signal,
    },
    { rejectWithValue }
  ) => {
    const formData = new FormData();
    formData.append("en[title]", entitle);
    formData.append("en[content]", encontent);
    formData.append("fr[title]", frtitle);
    formData.append("fr[content]", frcontent);
    formData.append("image", image);
    formData.append("website", website);
    formData.append("paid", paid);
    formData.append("category", category);
    for (const key in tags) {
      formData.append("tags", tags[key]);
    }
    signal.current = new AbortController();
    try {
      const { data } = await PostUrl(`article/${id}`, {
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

export const handleDeleteArticle = createAsyncThunk(
  "article/handleDeleteArticle",
  async ({ token, id, signal }, { rejectWithValue }) => {
    signal.current = new AbortController();

    try {
      const { data } = await GetUrl(`article/delete/${id}`, {
        headers: {
          Authorization: token,
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

const initialState = {
  articleLoading: false,
  articles: [],
  removeLoading: false,
  addAndEditLoading: false,
  singleArticle: null,
};

const ArticleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    handleChangeSingleArticle: (state, { payload }) => {
      state.singleArticle = payload;
    },
  },
  extraReducers: (buidler) => {
    // get all articles
    buidler
      .addCase(handleGetArticles.pending, (state) => {
        state.articleLoading = true;
      })
      .addCase(handleGetArticles.fulfilled, (state, { payload }) => {
        state.articleLoading = false;
        state.articles = payload?.articles;
        state.error = null;
      })
      .addCase(handleGetArticles.rejected, (state, { payload }) => {
        state.articleLoading = false;
        state.articles = [];
        state.error = payload ?? null;
      });

    // get by id article
    buidler
      .addCase(handleGetArticleById.pending, (state) => {
        state.articleLoading = true;
      })
      .addCase(handleGetArticleById.fulfilled, (state, { payload }) => {
        state.articleLoading = false;
        state.singleArticle = payload?.article;
        state.error = null;
      })
      .addCase(handleGetArticleById.rejected, (state, { payload }) => {
        state.articleLoading = false;
        state.singleArticle = null;
        state.error = payload ?? null;
      });

    // add article
    buidler
      .addCase(handleAddArticle.pending, (state) => {
        state.addAndEditLoading = true;
      })
      .addCase(handleAddArticle.fulfilled, (state, { payload }) => {
        state.addAndEditLoading = false;
        state.articles = [payload?.article, ...state?.articles];
        state.error = null;
      })
      .addCase(handleAddArticle.rejected, (state, { payload }) => {
        state.addAndEditLoading = false;
        state.error = payload ?? null;
      });

    // edit article
    buidler
      .addCase(handleEditArticle.pending, (state) => {
        state.addAndEditLoading = true;
      })
      .addCase(handleEditArticle.fulfilled, (state, { payload, meta }) => {
        state.addAndEditLoading = false;
        state.articles = state.articles.map((article) => {
          if (article?._id === meta.arg.id) {
            return payload?.article;
          } else {
            return article;
          }
        });
        state.error = null;
      })
      .addCase(handleEditArticle.rejected, (state, { payload }) => {
        state.addAndEditLoading = false;
        state.error = payload ?? null;
      });

    // delete article
    buidler
      .addCase(handleDeleteArticle.pending, (state) => {
        state.removeLoading = true;
      })
      .addCase(handleDeleteArticle.fulfilled, (state, { payload, meta }) => {
        state.removeLoading = false;
        state.articles = state.articles.filter((article) => {
          return article?._id !== meta.arg.id;
        });
        state.error = null;
      })
      .addCase(handleDeleteArticle.rejected, (state, { payload }) => {
        state.removeLoading = false;
        state.error = payload ?? null;
      });
  },
});

export const { handleChangeSingleArticle } = ArticleSlice.actions;

export default ArticleSlice.reducer;
