import { createSlice } from "@reduxjs/toolkit";

const initialExpensesState: { expenses: Expense[] } = {
  expenses: [] as Expense[],
};

//Dummy expenses
// {
//   id: uuidv4(),
//   name: "KFC",
//   amount: 10,
//   splitBetween: [
//     ["alex", 6],
//     ["kevin", 4],
//     ["anna", 0],
//   ],
//   paidBy: "alex",
//   date: "01-04-2022",
// },
// {
//   id: uuidv4(),
//   name: "petrol",
//   amount: 150,
//   splitBetween: [
//     ["alex", 50],
//     ["anna", 50],
//     ["kevin", 50],
//   ],
//   paidBy: "anna",
//   date: "02-04-2022",
// },
// {
//   id: uuidv4(),
//   name: "accomodation",
//   amount: 375,
//   splitBetween: [
//     ["alex", 125],
//     ["anna", 125],
//     ["kevin", 125],
//   ],
//   paidBy: "anna",
//   date: "03-04-2022",
// },

const expenseSlice = createSlice({
  name: "expenses",
  initialState: initialExpensesState,
  reducers: {
    addExpenseReducer(state, action) {
      state.expenses.unshift(action.payload.expense);
    },
    removeExpenseReducer(state, action) {
      const deleteIndex = state.expenses.findIndex(
        (expense) => expense.id === action.payload.id
      );
      if (deleteIndex !== -1) {
        state.expenses.splice(deleteIndex, 1);
      } else {
        console.error("Could not find expense to delete");
      }
    },
    changeUserExpenseReducer(state, action) {
      state.expenses.forEach((expense) => {
        if (expense.paidBy === action.payload.oldName) {
          expense.paidBy = action.payload.newName;
        }
        expense.splitBetween.forEach((user) => {
          if (user[0] === action.payload.oldName) {
            user[0] = action.payload.newName;
          }
        });
      });
    },
    addUserExpenseReducer(state, action) {
      state.expenses.forEach((expense) => {
        expense.splitBetween.push([action.payload.name, 0]);
      });
    },
    setExpensesReducer(state, action) {
      state.expenses = action.payload.expenses;
    },
  },
});

export const expenseActions = expenseSlice.actions;
export default expenseSlice.reducer;
