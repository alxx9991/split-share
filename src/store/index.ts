import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import expenseReducer from "./expenseReducer";

const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    users: userReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
