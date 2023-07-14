import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PostUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleRegisterUser = createAsyncThunk(
  "user/handleRegisterUser",
  async ({ name, email, role, password, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("signup", {
        data: { name, email, role, password },
        signal: signal.current.signal,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleLoginUser = createAsyncThunk(
  "user/handleLoginUser",
  async ({ email, password, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("login", {
        data: { email, password },
        signal: signal.current.signal,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleVerifyOtp = createAsyncThunk(
  "user/handleVerifyOtp",
  async ({ email, otp, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("verify-otp", {
        data: { email, otp },
        signal: signal.current.signal,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleUserLogout = createAsyncThunk(
  "user/handleUserLogout",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("logout", {
        signal: signal.current.signal,
        headers: {
          "consumer-access-token": token,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleForgotPassword = createAsyncThunk(
  "user/handleForgotPassword",
  async ({ email, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("forgot-password", {
        data: { email },
        signal: signal.current.signal,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const handleResetPassword = createAsyncThunk(
  "user/handleResetPassword",
  async ({ email, password, verifyToken, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("reset-password", {
        data: { email, password, verifyToken },
        signal: signal.current.signal,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  user: window.localStorage.getItem("user")
    ? JSON.parse(window.localStorage.getItem("user"))
    : null,
  role: window.localStorage.getItem("role")
    ? JSON.parse(window.localStorage.getItem("role"))
    : null,
  token: window.localStorage.getItem("token")
    ? JSON.parse(window.localStorage.getItem("token"))
    : null,
  verifyToken: window.localStorage.getItem("verify_token")
    ? window.localStorage.getItem("verify_token")
    : null,
  email: window.localStorage.getItem("email")
    ? JSON.parse(window.localStorage.getItem("email"))
    : null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleLogout: (state) => {
      state.loading = true;
      state.user = null;
      window.localStorage.clear();
      window.location.href = window.location.origin;
      toast.success("Logout Successfully.", { duration: 3000 });
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // register user
    builder.addCase(handleRegisterUser.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleRegisterUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.user = payload?.user;
      state.error = null;
      state.role = payload?.user?.role;
      state.token = payload?.token;
    });
    builder.addCase(handleRegisterUser.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.user = null;
      state.error = payload;
      state.role = null;
      state.token = null;
    });
    // login user
    builder.addCase(handleLoginUser.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleLoginUser.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.user = payload?.user;
      state.error = null;
      state.role = payload?.user?.role;
      state.token = payload?.token;
    });
    builder.addCase(handleLoginUser.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.user = null;
      state.error = payload;
      state.role = null;
      state.token = null;
    });
    // forgot password
    builder.addCase(handleForgotPassword.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleForgotPassword.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.user = payload?.otp;
      state.error = null;
      state.role = null;
      state.token = null;
    });
    builder.addCase(handleForgotPassword.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.user = null;
      state.error = payload;
      state.role = null;
      state.token = null;
    });
    // reset password
    builder.addCase(handleResetPassword.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleResetPassword.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.user = null;
      state.error = null;
      state.role = null;
      state.token = null;
    });
    builder.addCase(handleResetPassword.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.user = null;
      state.error = payload;
      state.role = null;
      state.token = null;
    });
    // verfiy otp
    builder.addCase(handleVerifyOtp.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleVerifyOtp.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.user = null;
      state.error = null;
      state.role = null;
      state.token = null;
      state.verifyToken = payload?.verifyToken;
    });
    builder.addCase(handleVerifyOtp.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
    });
    // log out
    builder.addCase(handleUserLogout.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleUserLogout.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.user = null;
      state.role = null;
      state.token = null;
    });
    builder.addCase(handleUserLogout.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload;
      state.user = null;
      state.role = null;
      state.token = null;
    });
  },
});

export const { handleLogout } = UserSlice.actions;

export default UserSlice.reducer;
