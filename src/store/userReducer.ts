import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const userInitialState = {
  users: {
    user1: { id: uuidv4(), name: "alex", paymentDetails: "Beem: @alxx9991" },
    user2: { id: uuidv4(), name: "anna", paymentDetails: "Beem: @aznna" },
    user3: { id: uuidv4(), name: "kevin", paymentDetails: "Beem: @kevinnli" },
  } as { [key: string]: User },
  selectedUser: null as User | null,
};

//Demo users
// [
//   { id: uuidv4(), name: "alex", paymentDetails: "Beem: @alxx9991" },
//   { id: uuidv4(), name: "anna", paymentDetails: "Beem: @aznna" },
//   { id: uuidv4(), name: "kevin", paymentDetails: "Beem: @kevinnli" },
// ]

const userSlice = createSlice({
  name: "users",
  initialState: userInitialState,
  reducers: {
    setUsersReducer: (state, action) => {
      state.users = action.payload.users;
      if (action.payload.selectedUser !== undefined) {
        state.selectedUser = action.payload.selectedUser;
      }
    },
    setSelectedUserReducer: (state, action) => {
      state.selectedUser = action.payload.selectedUser;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
