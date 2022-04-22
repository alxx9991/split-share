import Card from "../ui/Card";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import classes from "./ExpensesList.module.css";
import ExpensesListSplit from "./ExpensesListSplit";
import { expenseActions } from "../../store/expenseReducer";

const ExpensesList = () => {
  const expensesList = useSelector(
    (state: RootState) => state.expenses.expenses
  );

  const dispatch = useDispatch();

  const deleteButtonClickHandler = (id: string) => {
    dispatch(expenseActions.removeExpenseReducer({ id }));
  };

  const tableRows = expensesList.map((expense: Expense) => {
    return (
      <tr key={expense.id} className={classes.table__tr}>
        <td className={classes.table__td}>{expense.name}</td>
        <td className={classes.table__td}>{expense.date}</td>
        <td className={classes.table__td}>${expense.amount}</td>
        <td className={classes.table__td}>{expense.paidBy}</td>
        <td className={classes.table__td}>
          <ExpensesListSplit
            splitBetween={expense.splitBetween}
          ></ExpensesListSplit>
        </td>
        <td className={classes.table__td}>
          <button
            className={classes.table__button}
            onClick={() => {
              deleteButtonClickHandler(expense.id);
            }}
          >
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyA2djE4aDE4di0xOGgtMTh6bTUgMTRjMCAuNTUyLS40NDggMS0xIDFzLTEtLjQ0OC0xLTF2LTEwYzAtLjU1Mi40NDgtMSAxLTFzMSAuNDQ4IDEgMXYxMHptNSAwYzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xdi0xMGMwLS41NTIuNDQ4LTEgMS0xczEgLjQ0OCAxIDF2MTB6bTUgMGMwIC41NTItLjQ0OCAxLTEgMXMtMS0uNDQ4LTEtMXYtMTBjMC0uNTUyLjQ0OC0xIDEtMXMxIC40NDggMSAxdjEwem00LTE4djJoLTIwdi0yaDUuNzExYy45IDAgMS42MzEtMS4wOTkgMS42MzEtMmg1LjMxNWMwIC45MDEuNzMgMiAxLjYzMSAyaDUuNzEyeiIvPjwvc3ZnPg=="
              alt="trash"
            />
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className={classes["expense-list"]}>
      <Card>
        <h2>Expense List</h2>
        {tableRows.length > 0 ? (
          <div className={classes.table__container}>
            <table className={classes.table}>
              <thead>
                <tr className={classes.table__tr}>
                  <th className={classes.table__th}>Expense Name</th>
                  <th className={classes.table__th}>Date</th>
                  <th className={classes.table__th}>Amount</th>
                  <th className={classes.table__th}>Paid By</th>
                  <th className={classes.table__th}>Shared Between</th>
                  <th className={classes.table__th}>Delete</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          </div>
        ) : (
          <p>No expenses added yet.</p>
        )}
      </Card>
    </div>
  );
};

export default ExpensesList;
