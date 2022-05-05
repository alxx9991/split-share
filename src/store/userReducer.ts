import { createSlice } from "@reduxjs/toolkit";
// import { v4 as uuidv4 } from "uuid";

const userInitialState = {
  users: [] as User[],
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
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    editUser: (state, action) => {
      const user = state.users.find(
        (user) => user.name === action.payload.currentName
      );
      if (user) {
        console.log(action.payload);
        user.name = action.payload.name;
        user.paymentDetails = action.payload.paymentDetails;
      } else {
        console.error("User not found");
      }
    },
    removeUser: (state, action) => {
      const deleteIndex = state.users.findIndex(
        (user) => user.name === action.payload.name
      );
      if (deleteIndex !== -1) {
        state.users.splice(deleteIndex, 1);
      } else {
        console.error("Could not find user to delete");
      }
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
