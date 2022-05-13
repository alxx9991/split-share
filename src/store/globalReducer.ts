import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: {
    docID: "",
    listName: "",
  },
  reducers: {
    setDocIDReducer(state, action) {
      state.docID = action.payload.docID;
      return state;
    },
    setListNameReducer(state, action) {
      state.listName = action.payload.listName;
      return state;
    },
  },
});

export const globalActions = globalSlice.actions;
export default globalSlice.reducer;
