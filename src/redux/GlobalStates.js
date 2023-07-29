import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { BroadcastChannel } from "broadcast-channel";
import i18next from "i18next";

const initialState = {
  searchTerm: "",
  fileterdData: [],
  language: JSON.parse(window.localStorage.getItem("lang")) ?? "en",
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
            typeof val === "string" && val.toLocaleLowerCase().includes(value)
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
} = GlobalStates.actions;

export default GlobalStates.reducer;
