import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetAllUsers = createAsyncThunk(
  "user/handleGetAllUsers",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("user", {
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

export const handleAddNewUser = createAsyncThunk(
  "user/handleAddNewUser",
  async (
    {
      role,
      name,
      email,
      profile,
      password,
      phone,
      company,
      address,
      city,
      zipCode,
      country,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("user", {
        data: {
          role,
          name,
          email,
          profile,
          password,
          phone,
          company,
          address,
          city,
          zipCode,
          country,
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

const initialState = {
  loading: false,
  error: null,
  success: false,
  users: [],
  filterType: "newest",
  singleUser: null,
  postLoading: false,
};

const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    handlerFilterUsers: (state, { payload }) => {
      state.filterType = payload;
      state.users = state.users?.slice().reverse();
    },
    handleFindUser: (state, { payload }) => {
      if (payload !== "") {
        const findUser = state.users.find((user) => user?._id === payload);
        if (findUser) {
          state.singleUser = findUser;
        }
      } else {
        state.singleUser = null;
      }
    },
    handleDeleteUser: (state, { payload }) => {
      const findUser = state.users.filter((user) => user?._id !== payload);
      if (findUser) {
        state.users = findUser;
      }
    },
  },
  extraReducers: (builder) => {
    // get all users
    builder.addCase(handleGetAllUsers.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetAllUsers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.users = payload?.users;
      state.error = null;
    });
    builder.addCase(handleGetAllUsers.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.users = [];
      state.error = payload ?? null;
    });
    // add new user
    builder.addCase(handleAddNewUser.pending, (state, {}) => {
      state.postLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleAddNewUser.fulfilled, (state, { payload }) => {
      state.postLoading = false;
      state.success = true;
      state.error = null;
      state.users = [payload?.user, ...state.users];
    });
    builder.addCase(handleAddNewUser.rejected, (state, { payload }) => {
      state.postLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
  },
});

export const { handlerFilterUsers, handleFindUser, handleDeleteUser } =
  UserSlice.actions;

export default UserSlice.reducer;
