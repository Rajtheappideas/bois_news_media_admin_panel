import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
  magazines: [],
  filterType: "newest",
  singleUser: null,
  addNewUserLoading: false,
  deleteUserLoading: false,
  EditUserLoading: false,
  deleteUserID: null,
};

const MagazineSlice = createSlice({
  name: "magazine",
  initialState,
  reducers: {},
});

export const {} = MagazineSlice.actions;

export default MagazineSlice.reducer;
