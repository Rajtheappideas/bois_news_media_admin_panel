import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetUrl, PostUrl } from "../BaseUrl";
import { toast } from "react-hot-toast";

export const handleGetAllSubscribers = createAsyncThunk(
  "user/handleGetAllSubscribers",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("subscriber", {
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

export const handleAddNewSubscriber = createAsyncThunk(
  "user/handleAddNewSubscriber",
  async (
    {
      fname,
      lname,
      email,
      title,
      company,
      civility,
      phone,
      mobile,
      address1,
      address2,
      address3,
      zipCode,
      city,
      province,
      country,
      baddress1,
      baddress2,
      baddress3,
      bzipCode,
      bcity,
      bprovince,
      bcountry,
      thirdPartyPayer,
      accountingContact,
      accountingEmail,
      accountingPhone,
      VATcode,
      VATnumber,
      companyRegNum,
      companyWebsite,
      activityDomain,
      contactOrigin,
      clientCode,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("subscriber", {
        data: {
          fname,
          lname,
          email,
          title,
          company,
          civility,
          phone,
          mobile,
          shippingAddress: {
            address1,
            address2,
            address3,
            zipCode,
            city,
            province,
            country,
          },
          billingAddress: {
            address1: baddress1,
            address2: baddress2,
            address3: baddress3,
            zipCode: bzipCode,
            city: bcity,
            province: bprovince,
            country: bcountry,
          },
          thirdPartyPayer,
          billingSupplement: {
            accountingContact,
            accountingEmail,
            accountingPhone,
            VATcode,
            VATnumber,
            companyRegNum,
            companyWebsite,
            activityDomain,
            contactOrigin,
            clientCode,
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

export const handleEditSubscriber = createAsyncThunk(
  "user/handleEditSubscriber",
  async (
    {
      fname,
      lname,
      email,
      title,
      company,
      civility,
      phone,
      mobile,
      address1,
      address2,
      address3,
      zipCode,
      city,
      province,
      country,
      baddress1,
      baddress2,
      baddress3,
      bzipCode,
      bcity,
      bprovince,
      bcountry,
      thirdPartyPayer,
      accountingContact,
      accountingEmail,
      accountingPhone,
      VATcode,
      VATnumber,
      companyRegNum,
      companyWebsite,
      activityDomain,
      contactOrigin,
      clientCode,
      id,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`subscriber/${id}`, {
        data: {
          fname,
          lname,
          email,
          title,
          company,
          civility,
          phone,
          mobile,
          shippingAddress: {
            address1,
            address2,
            address3,
            zipCode,
            city,
            province,
            country,
          },
          billingAddress: {
            address1: baddress1,
            address2: baddress2,
            address3: baddress3,
            zipCode: bzipCode,
            city: bcity,
            province: bprovince,
            country: bcountry,
          },
          thirdPartyPayer,
          billingSupplement: {
            accountingContact,
            accountingEmail,
            accountingPhone,
            VATcode,
            VATnumber,
            companyRegNum,
            companyWebsite,
            activityDomain,
            contactOrigin,
            clientCode,
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

export const handleDeleteSUBSCRIBER = createAsyncThunk(
  "user/handleDeleteSUBSCRIBER",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`subscriber/delete/${id}`, {
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
  success: false,
  error: null,
  subscribers: [],
  addNewSubscriberLoading: false,
  singleSucriber: null,
  deleteLoading: false,
  editLoading: false,
  deleteSubscriberID: null,
};

const SubscriberSlice = createSlice({
  name: "subscirbers",
  initialState,
  reducers: {
    handleFindSubscriber: (state, { payload }) => {
      if (payload !== "") {
        const findSubscriber = state.subscribers.find(
          (subscriber) => subscriber?._id === payload
        );
        if (findSubscriber) {
          state.singleSucriber = findSubscriber;
        }
      } else {
        state.singleSucriber = null;
      }
    },
    handleDeleteSubscriber: (state, { payload }) => {
      const findSubcriber = state.subscribers.filter(
        (subscriber) => subscriber?._id !== payload
      );
      if (findSubcriber) {
        state.subscribers = findSubcriber;
      }
    },
    handleChangeDeleteID: (state, { payload }) => {
      state.deleteSubscriberID = payload;
    },
  },
  extraReducers: (builder) => {
    // get all subscribers
    builder.addCase(handleGetAllSubscribers.pending, (state, {}) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetAllSubscribers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.subscribers = payload?.subscriber;
      state.error = null;
    });
    builder.addCase(handleGetAllSubscribers.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.subscribers = [];
      state.error = payload ?? null;
    });
    // add new subscriber
    builder.addCase(handleAddNewSubscriber.pending, (state, {}) => {
      state.addNewSubscriberLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleAddNewSubscriber.fulfilled, (state, { payload }) => {
      state.addNewSubscriberLoading = false;
      state.success = true;
      state.error = null;
      state.subscribers = [payload?.subscriber, ...state.subscribers];
    });
    builder.addCase(handleAddNewSubscriber.rejected, (state, { payload }) => {
      state.addNewSubscriberLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // edit subscriber
    builder.addCase(handleEditSubscriber.pending, (state, {}) => {
      state.editLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleEditSubscriber.fulfilled, (state, { payload }) => {
      state.editLoading = false;
      state.success = true;
      state.error = null;
      state.subscribers = state.subscribers.map((subscriber) =>
        subscriber?._id === payload?.subscriber?._id
          ? payload?.subscriber
          : subscriber
      );
    });
    builder.addCase(handleEditSubscriber.rejected, (state, { payload }) => {
      state.editLoading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // delete subscirber
    builder.addCase(handleDeleteSUBSCRIBER.pending, (state, {}) => {
      state.deleteLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleDeleteSUBSCRIBER.fulfilled, (state, { payload }) => {
      state.deleteLoading = false;
      state.success = true;
      state.error = null;
      state.deleteSubscriberID = null;
    });
    builder.addCase(handleDeleteSUBSCRIBER.rejected, (state, { payload }) => {
      state.deleteLoading = false;
      state.success = false;
      state.error = payload ?? null;
      state.deleteSubscriberID = null;
    });
  },
});

export const {
  handleFindSubscriber,
  handleDeleteSubscriber,
  handleChangeDeleteID,
} = SubscriberSlice.actions;

export default SubscriberSlice.reducer;
