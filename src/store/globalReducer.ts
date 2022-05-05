import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {
    activePage: "expenses",
  },
  reducers: {
    changeActivePageReducer(state, payload) {
      state.activePage = payload.payload.page;
      return state;
    },
  },
});

export const globalActions = globalSlice.actions;
export default globalSlice.reducer;
