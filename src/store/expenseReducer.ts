import { createSlice } from "@reduxjs/toolkit";

const initialExpensesState: { expenses: { [key: string]: Expense } } = {
  //Dummy expenses
  expenses: {},
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState: initialExpensesState,
  reducers: {
    setExpensesReducer(state, action) {
      state.expenses = action.payload.expenses;
    },
  },
});

export const expenseActions = expenseSlice.actions;
export default expenseSlice.reducer;
