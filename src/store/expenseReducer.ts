import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialExpensesState: { expenses: Expense[] } = {
  expenses: [
    {
      id: uuidv4(),
      name: "KFC",
      amount: 10,
      splitBetween: [
        ["alex", 6],
        ["kevin", 4],
      ],
      paidBy: "alex",
      date: "01-04-2022",
    },
    {
      id: uuidv4(),
      name: "petrol",
      amount: 150,
      splitBetween: [
        ["alex", 50],
        ["anna", 50],
        ["kevin", 50],
      ],
      paidBy: "anna",
      date: "02-04-2022",
    },
    {
      id: uuidv4(),
      name: "accomodation",
      amount: 375,
      splitBetween: [
        ["alex", 125],
        ["anna", 125],
        ["kevin", 125],
      ],
      paidBy: "anna",
      date: "03-04-2022",
    },
  ],
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState: initialExpensesState,
  reducers: {
    addExpenseReducer(state, payload) {
      state.expenses.unshift(payload.payload.expense);
      return state;
    },
    removeExpenseReducer(state, payload) {
      const deleteIndex = state.expenses.findIndex(
        (expense) => expense.id === payload.payload.id
      );
      if (deleteIndex !== -1) {
        state.expenses.splice(deleteIndex, 1);
      } else {
        console.error("Could not find expense to delete");
      }
      return state;
    },
  },
});

export const expenseActions = expenseSlice.actions;
export default expenseSlice.reducer;
