import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  thirdPartyPayers: [],
  filterType: "newest",
  singleUser: null,
  addNewUserLoading: false,
  deleteUserLoading: false,
  EditUserLoading: false,
  deleteUserID: null,
};

const ThirdPartyPayerSlice = createSlice({
  name: "thirdpartypayer",
  initialState,
  reducers: {},
});

export const {} = ThirdPartyPayerSlice.actions;

export default ThirdPartyPayerSlice.reducer;
