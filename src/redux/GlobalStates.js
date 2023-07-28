import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  searchTerm: "",
  fileterdData: [],
};

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

        return toast.error(`${"Nothing found releated"} "${value}"`, {
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
  },
});

export const { handleChangeFilteredData, handleSearch } = GlobalStates.actions;

export default GlobalStates.reducer;
