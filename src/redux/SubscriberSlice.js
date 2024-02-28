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

export const handleGetSubscriberById = createAsyncThunk(
  "user/handleGetSubscriberById",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`subscriber/${id}`, {
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

export const handleCreateSubsciption = createAsyncThunk(
  "user/handleCreateSubsciption",
  async (
    {
      subscriber,
      subscription,
      subState,
<<<<<<< HEAD
      prospectState,
      startDate,
      renewDate,
=======
      remainingIssues,
>>>>>>> raj_appideas
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl("subscriber/subscription", {
        data: {
          subscriber,
          subscription,
          subState,
<<<<<<< HEAD
          prospectState,
          startDate,
          renewDate,
=======
          remainingIssues,
>>>>>>> raj_appideas
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

export const handleEditSubsciption = createAsyncThunk(
  "user/handleEditSubsciption",
  async (
    {
      subState,
<<<<<<< HEAD
      prospectState,
      startDate,
      renewDate,
      subscription,
=======
      subscription,
      remainingIssues,
>>>>>>> raj_appideas
      id,
      token,
      signal,
    },
    { rejectWithValue }
  ) => {
    try {
      signal.current = new AbortController();
      const response = await PostUrl(`subscriber/subscription/${id}`, {
        data: {
          subscription,
          subState,
<<<<<<< HEAD
          prospectState,
          startDate,
          renewDate,
=======
          remainingIssues
>>>>>>> raj_appideas
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

export const handleDeleteSUBSCRIPTION = createAsyncThunk(
  "user/handleDeleteSUBSCRIPTION",
  async ({ id, token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl(`subscriber/subscription/delete/${id}`, {
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

const initialState = {
  loading: false,
  success: false,
  error: null,
  subscribers: [],
  addNewSubscriberLoading: false,
  singleSucriber: null,
  singleSucriberLoading: false,
  deleteLoading: false,
  editLoading: false,
  deleteSubscriberID: null,
  deleteSubscriptionID: null,
  singleSubscription: null,
  showMagazineDistributionPopup: false,
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

    handleDeleteSubscription: (state, { payload }) => {
      const findSubcription = state.subscribers.map((subscriber) =>
        subscriber._id === payload?.subscriberId
          ? {
<<<<<<< HEAD
              ...subscriber,
              subscriptions: subscriber.subscriptions.filter(
                (subscription) => subscription?._id !== payload?.id
              ),
            }
=======
            ...subscriber,
            subscriptions: subscriber.subscriptions.filter(
              (subscription) => subscription?._id !== payload?.id
            ),
          }
>>>>>>> raj_appideas
          : subscriber
      );
      if (findSubcription) {
        state.subscribers = findSubcription;
        state.singleSucriber = {
          ...state.singleSucriber,
          subscriptions: state.singleSucriber.subscriptions.filter(
            (subscription) => subscription?._id !== payload?.id
          ),
        };
      }
    },

    handleChangeDeleteID: (state, { payload }) => {
      state.deleteSubscriberID = payload;
    },

    handleChangeDeleteSubscriptionID: (state, { payload }) => {
      state.deleteSubscriptionID = payload;
    },

    handleFindSubscription: (state, { payload }) => {
      if (payload !== "") {
        const findSubscriber = state.subscribers.find(
          (subscriber) => subscriber?._id === payload?.subscriberId
        );

        const findSubscription = findSubscriber?.subscriptions.find(
          (subscription) => subscription?._id === payload?.subscriptionId
        );
        if (findSubscription) {
          state.singleSubscription = findSubscription;
        }
      } else {
        state.singleSubscription = null;
      }
    },

<<<<<<< HEAD
    handleClearSingleSubscription: (state, {}) => {
=======
    handleClearSingleSubscription: (state, { }) => {
>>>>>>> raj_appideas
      state.singleSubscription = null;
    },

    handleChangeSingleSubscriber: (state, { payload }) => {
      state.singleSucriber = payload;
    },

    handleChangeMagazineDistributionPopup: (state, { payload }) => {
      state.showMagazineDistributionPopup = payload;
    },
  },
  extraReducers: (builder) => {
    // get all subscribers
<<<<<<< HEAD
    builder.addCase(handleGetAllSubscribers.pending, (state, {}) => {
=======
    builder.addCase(handleGetAllSubscribers.pending, (state, { }) => {
>>>>>>> raj_appideas
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

    // get subscriber by id
<<<<<<< HEAD
    builder.addCase(handleGetSubscriberById.pending, (state, {}) => {
=======
    builder.addCase(handleGetSubscriberById.pending, (state, { }) => {
>>>>>>> raj_appideas
      state.singleSucriberLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleGetSubscriberById.fulfilled, (state, { payload }) => {
      state.singleSucriberLoading = false;
      state.success = true;
      state.singleSucriber = payload?.subscriber;
      state.error = null;
    });
    builder.addCase(handleGetSubscriberById.rejected, (state, { payload }) => {
      state.singleSucriberLoading = false;
      state.success = false;
      state.singleSucriber = null
      state.error = payload ?? null;
    });
    // add new subscriber
<<<<<<< HEAD
    builder.addCase(handleAddNewSubscriber.pending, (state, {}) => {
=======
    builder.addCase(handleAddNewSubscriber.pending, (state, { }) => {
>>>>>>> raj_appideas
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
    // create subscriptin
<<<<<<< HEAD
    builder.addCase(handleCreateSubsciption.pending, (state, {}) => {
=======
    builder.addCase(handleCreateSubsciption.pending, (state, { }) => {
>>>>>>> raj_appideas
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleCreateSubsciption.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.subscribers = state.subscribers.map((subscriber) =>
        subscriber?._id === payload?.subscription?.subscriber
          ? {
<<<<<<< HEAD
              ...subscriber,
              subscriptions: [
                ...subscriber?.subscriptions,
                payload?.subscription,
              ],
            }
=======
            ...subscriber,
            subscriptions: [
              ...subscriber?.subscriptions,
              payload?.subscription,
            ],
          }
>>>>>>> raj_appideas
          : subscriber
      );
      state.singleSucriber = {
        ...state.singleSucriber,
        subscriptions: [
          ...state.singleSucriber?.subscriptions,
          payload?.subscription,
        ],
      };
    });
    builder.addCase(handleCreateSubsciption.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // edit subscriptin
<<<<<<< HEAD
    builder.addCase(handleEditSubsciption.pending, (state, {}) => {
=======
    builder.addCase(handleEditSubsciption.pending, (state, { }) => {
>>>>>>> raj_appideas
      state.loading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(handleEditSubsciption.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.error = null;
      state.subscribers = state.subscribers.map((subscriber) =>
        subscriber?._id === payload?.subscription?.subscriber
          ? {
<<<<<<< HEAD
              ...subscriber,
              subscriptions: subscriber?.subscriptions.map((s) =>
                s?._id === payload?.subscription?._id
                  ? payload?.subscription
                  : s
              ),
            }
=======
            ...subscriber,
            subscriptions: subscriber?.subscriptions.map((s) =>
              s?._id === payload?.subscription?._id
                ? payload?.subscription
                : s
            ),
          }
>>>>>>> raj_appideas
          : subscriber
      );
      state.singleSucriber = {
        ...state.singleSucriber,
        subscriptions: state.singleSucriber?.subscriptions.map((s) =>
          s?._id === payload?.subscription?._id ? payload?.subscription : s
        ),
      };
    });
    builder.addCase(handleEditSubsciption.rejected, (state, { payload }) => {
      state.loading = false;
      state.success = false;
      state.error = payload ?? null;
    });
    // edit subscriber
<<<<<<< HEAD
    builder.addCase(handleEditSubscriber.pending, (state, {}) => {
=======
    builder.addCase(handleEditSubscriber.pending, (state, { }) => {
>>>>>>> raj_appideas
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
<<<<<<< HEAD
    builder.addCase(handleDeleteSUBSCRIBER.pending, (state, {}) => {
=======
    builder.addCase(handleDeleteSUBSCRIBER.pending, (state, { }) => {
>>>>>>> raj_appideas
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
    // delete subscription
<<<<<<< HEAD
    builder.addCase(handleDeleteSUBSCRIPTION.pending, (state, {}) => {
=======
    builder.addCase(handleDeleteSUBSCRIPTION.pending, (state, { }) => {
>>>>>>> raj_appideas
      state.deleteLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(
      handleDeleteSUBSCRIPTION.fulfilled,
      (state, { payload }) => {
        state.deleteLoading = false;
        state.success = true;
        state.error = null;
      }
    );
    builder.addCase(handleDeleteSUBSCRIPTION.rejected, (state, { payload }) => {
      state.deleteLoading = false;
      state.success = false;
      state.error = payload ?? null;
      state.deleteSubscriptionID = null;
    });
  },
});

export const {
  handleFindSubscriber,
  handleDeleteSubscriber,
  handleChangeDeleteID,
  handleChangeDeleteSubscriptionID,
  handleDeleteSubscription,
  handleFindSubscription,
  handleClearSingleSubscription,
  handleChangeSingleSubscriber,
  handleChangeMagazineDistributionPopup,
} = SubscriberSlice.actions;

export default SubscriberSlice.reducer;
