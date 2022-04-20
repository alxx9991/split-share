import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const userInitialState = {
  users: [
    { id: uuidv4(), name: "alex", paymentDetails: "Beem: @alxx9991" },
    { id: uuidv4(), name: "anna", paymentDetails: "Beem: @aznna" },
    { id: uuidv4(), name: "kevin", paymentDetails: "Beem: @kevinnli" },
  ],
};

const userSlice = createSlice({
  name: "users",
  initialState: userInitialState,
  reducers: {},
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
