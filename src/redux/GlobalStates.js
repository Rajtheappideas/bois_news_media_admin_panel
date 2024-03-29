import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { BroadcastChannel } from "broadcast-channel";
import i18next from "i18next";
import { GetUrl } from "../BaseUrl";

export const handleGetNewsLetter = createAsyncThunk(
  "global/handleGetNewsLetter",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("newsletter", {
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
<<<<<<< HEAD
  },
=======
  }
>>>>>>> raj_appideas
);

export const handleGetCount = createAsyncThunk(
  "global/handleGetCount",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("dashboard", {
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
<<<<<<< HEAD
  },
=======
  }
>>>>>>> raj_appideas
);

export const handleGetMessages = createAsyncThunk(
  "global/handleGetMessages",
  async ({ token, signal }, { rejectWithValue }) => {
    try {
      signal.current = new AbortController();
      const response = await GetUrl("contact", {
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
<<<<<<< HEAD
  },
=======
  }
>>>>>>> raj_appideas
);

const initialState = {
  searchTerm: "",
  fileterdData: [],
<<<<<<< HEAD
  language: JSON.parse(window.localStorage.getItem("lang")) ?? "en",
=======
  language: JSON.parse(window.localStorage.getItem("lang")) ?? "fr",
>>>>>>> raj_appideas
  newsLetters: [],
  messages: [],
  newsLetterLoading: false,
  messageLoading: false,
  isSidebarOpen: false,
  activeSidebarTab: "dashboard",
  counts: null,
  countLoading: false,
<<<<<<< HEAD
=======
  eec_switzerland_overseas_territories: [
    "Germany",
    "Switzerland",
    "Austria",
    "Belgium",
    "Bulgaria",
    "Cyprus",
    "Croatia",
    "Denmark",
    "Spain",
    "Estonia",
    "Finland",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Poland",
    "Portugal",
    "Czech Republic",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Sweden",
    "Guadeloupe",
    "Martinique",
    "French Guiana",
    "Reunion",
    "Mayotte",
    "Saint Pierre and Miquelon",
    "Saint Barthelemy",
    "Saint Martin",
    "Wallis and Futuna",
    "French Polynesia",
    "New Caledonia",
    "Clipperton Island",
    "guadeloupe",
    "martinique",
    "french guiana",
    "réunion",
    "mayotte",
    "saint pierre and miquelon",
    "saint barthélemy",
    "saint martin",
    "wallis and futuna",
    "french polynesia",
    "new caledonia",
    "clipperton island",
  ],
>>>>>>> raj_appideas
};

const logoutChannel = new BroadcastChannel("handleLogout");
const loginChannel = new BroadcastChannel("handleSuccess");

const GlobalStates = createSlice({
  name: "global",
  initialState,
  reducers: {
    handleChangeFilteredData: (state, { payload }) => {
      state.fileterdData = payload;
    },

    handleSearch: (state, { payload: { data, value } }) => {
      state.searchTerm = value;
      const filtered = data.filter((entry) => {
        return Object.values(entry).some((val) => {
          return (
            (typeof val === "string" || typeof val === "number") &&
            val.toString().toLocaleLowerCase().includes(value)
          );
        });
      });
      if (filtered.length !== 0) {
        state.fileterdData = filtered;
      } else {
        toast.remove();
        state.fileterdData = [];

        state.searchTerm !== "" &&
          toast.error(`${"Nothing found releated"} "${value}"`, {
            style: {
              maxWidth: "100%",
              maxHeight: "200px",
              backgroundColor: "black",
              color: "white",
            },
            duration: 2000,
          });
      }
    },

    handleClearFilteredData: (state) => {
      state.fileterdData = [];
    },

    handleSuccess: () => {
      loginChannel.postMessage("");
      loginChannel.onmessage = (event) => {
        loginChannel.close();
      };
    },

    handleLogoutFromAllTabs: () => {
      logoutChannel.postMessage("");
      logoutChannel.onmessage = (event) => {
        logoutChannel.close();
      };
    },

    logoutAllTabsEventListener: () => {
      logoutChannel.onmessage = (event) => {
        logoutChannel.close();
        window.location.reload();
      };
    },

    loginAllTabsEventListener: () => {
      loginChannel.onmessage = (event) => {
        window.location.reload();
        loginChannel.close();
      };
    },

    handleChangeUserLanguage: (state, { payload }) => {
      state.language = payload;
      i18next.changeLanguage(payload);
    },

    handlerFilterNewsLetters: (state, { payload }) => {
      state.newsLetters = state.newsLetters?.slice().reverse();
    },

    handlerFilterMessages: (state, { payload }) => {
      state.messages = state.messages?.slice().reverse();
    },

    handleToggleSidebar: (state, { payload }) => {
      state.isSidebarOpen = payload;
    },

    handleChagneActiveSidebarTab: (state, { payload }) => {
      state.activeSidebarTab = payload;
    },
  },
  extraReducers: (builder) => {
    // get all news letter
    builder.addCase(handleGetNewsLetter.pending, (state, {}) => {
      state.newsLetterLoading = true;
      state.error = null;
    });
    builder.addCase(handleGetNewsLetter.fulfilled, (state, { payload }) => {
      state.newsLetterLoading = false;
      state.newsLetters = payload?.newsletter;
      state.error = null;
    });
    builder.addCase(handleGetNewsLetter.rejected, (state, { payload }) => {
      state.newsLetterLoading = false;
      state.newsLetters = null;
      state.error = payload ?? null;
    });

    // get count
    builder.addCase(handleGetCount.pending, (state, {}) => {
      state.countLoading = true;
      state.error = null;
    });
    builder.addCase(handleGetCount.fulfilled, (state, { payload }) => {
      state.countLoading = false;
      state.counts = payload?.data;
      state.error = null;
    });
    builder.addCase(handleGetCount.rejected, (state, { payload }) => {
      state.countLoading = false;
      state.counts = null;
      state.error = payload ?? null;
    });
    // get all message
    builder.addCase(handleGetMessages.pending, (state, {}) => {
      state.messageLoading = true;
      state.error = null;
    });
    builder.addCase(handleGetMessages.fulfilled, (state, { payload }) => {
      state.messageLoading = false;
      state.messages = payload?.messages;
      state.error = null;
    });
    builder.addCase(handleGetMessages.rejected, (state, { payload }) => {
      state.messageLoading = false;
      state.messages = null;
      state.error = payload ?? null;
    });
  },
});

export const {
  handleChangeFilteredData,
  handleSearch,
  handleClearFilteredData,
  handleLogoutFromAllTabs,
  handleSuccess,
  loginAllTabsEventListener,
  logoutAllTabsEventListener,
  handleChangeUserLanguage,
  handlerFilterMessages,
  handlerFilterNewsLetters,
  handleToggleSidebar,
  handleChagneActiveSidebarTab,
} = GlobalStates.actions;

export default GlobalStates.reducer;
