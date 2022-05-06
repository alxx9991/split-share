import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {
    docID: "",
  },
  reducers: {
    changedocumentIDReducer(state, payload) {
      state.docID = payload.payload.docID;
      return state;
    },
  },
});

export const globalActions = globalSlice.actions;
export default globalSlice.reducer;
