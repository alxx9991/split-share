import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import expenseReducer from "./expenseReducer";
import globalReducer from "./globalReducer";

const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    users: userReducer,
    global: globalReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
