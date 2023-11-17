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

export const handleGetUserbyId = createAsyncThunk(
  "user/handleGetUserbyId",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`user/${id}`, {
        signal: signal.current.signal,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
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

export const handleEditUser = createAsyncThunk(
  "user/handleEditUser",
  async (
    {
      role,
      name,
      profile,
      phone,
      company,
      address,
      city,
      zipCode,
      country,
      id,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`user/${id}`, {
        data: {
          role,
          name,
          profile,
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

export const handleDeleteUSER = createAsyncThunk(
  "user/handleDeleteUSER",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`user/delete/${id}`, {
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
  users: [],
  filterType: "newest",
  singleUser: null,
  singleUserGetLoading: false,
  addNewUserLoading: false,
  deleteUserLoading: false,
  EditUserLoading: false,
  deleteUserID: null,
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
    handleChangeDeleteID: (state, { payload }) => {
      state.deleteUserID = payload;
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

    // get  user by id
    builder.addCase(handleGetUserbyId.pending, (state, {}) => {
      state.singleUserGetLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetUserbyId.fulfilled, (state, { payload }) => {
      state.singleUserGetLoading = false;
      state.success = true;
      state.singleUser = payload?.user;
      state.error = null;
    });
    builder.addCase(handleGetUserbyId.rejected, (state, { payload }) => {
      state.singleUserGetLoading = false;
      state.success = false;
      state.singleUser = null;
      state.error = payload ?? null;
    });
    // add new user
    builder.addCase(handleAddNewUser.pending, (state, {}) => {
      state.addNewUserLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleAddNewUser.fulfilled, (state, { payload }) => {
      state.addNewUserLoading = false;
      state.success = true;
      state.error = null;
      state.users = [payload?.user, ...state.users];
    });
    builder.addCase(handleAddNewUser.rejected, (state, { payload }) => {
      state.addNewUserLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // edit user
    builder.addCase(handleEditUser.pending, (state, {}) => {
      state.EditUserLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleEditUser.fulfilled, (state, { payload }) => {
      state.EditUserLoading = false;
      state.success = true;
      state.error = null;
      state.users = state.users.map((user) =>
        user?._id === payload?.user?._id ? payload?.user : user
      );
    });
    builder.addCase(handleEditUser.rejected, (state, { payload }) => {
      state.EditUserLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // delete user
    builder.addCase(handleDeleteUSER.pending, (state, {}) => {
      state.deleteUserLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleDeleteUSER.fulfilled, (state, { payload }) => {
      state.deleteUserLoading = false;
      state.success = true;
      state.error = null;
      state.deleteUserID = null;
    });
    builder.addCase(handleDeleteUSER.rejected, (state, { payload }) => {
      state.deleteUserLoading = false;
      state.success = false;
      state.error = payload ?? null;
      state.deleteUserID = null;
    });
  },
});

export const {
  handlerFilterUsers,
  handleFindUser,
  handleDeleteUser,
  handleChangeDeleteID,
} = UserSlice.actions;

export default UserSlice.reducer;
