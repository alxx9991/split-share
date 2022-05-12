import classes from "./styles/ExpenseTable.module.css";
import ExpensesListSplit from "../expenses/ExpensesListSplit";
import { useState } from "react";
import useUpdateData from "../../hooks/useUpdateData";
import { UpdateType } from "../../enums/updateType";

const ExpenseTable: React.FC<{
  expensesList: Expense[];
}> = (props) => {
  const [deletePending, setDeletePending] = useState("");
  const { updateDataReducer, error: updateError } = useUpdateData();

  //Handlers
  const deleteButtonClickHandler = async (id: string) => {
    setDeletePending(id);
    await updateDataReducer(UpdateType.DELETE_EXPENSE, { expenseID: id });
    setDeletePending("");
  };

  const tableRows = props.expensesList.map((expense: Expense) => {
    return (
      <tr key={expense.id} className={classes.table__tr}>
        <td className={classes.table__td}>{expense.date}</td>
        <td className={classes.table__td}>{expense.name}</td>
        <td className={classes.table__td}>${expense.amount}</td>
        <td className={classes.table__td}>{expense.paidBy}</td>
        <td className={classes.table__td}>
          <ExpensesListSplit
            splitBetween={expense.splitBetween}
          ></ExpensesListSplit>
        </td>
        <td className={classes.table__td}>
          <button
            className={
              deletePending === expense.id
                ? classes["table__button--loading"]
                : classes.table__button
            }
            onClick={() => {
              if (deletePending !== expense.id) {
                deleteButtonClickHandler(expense.id);
              }
            }}
          >
            {deletePending === expense.id ? (
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAeElEQVRIie2RMQqAMBAEh7zD1Hm7Ilhb+CMV9ANaGJsjRJSz24Etwk22uAMhhBAviUAP7DkDkP52I7AAh8maZ7bIze0LwzudKXN194qwmTI3N1DneJh/dgMwVYTRvF3dxHVwu44ZaMwHdzdyHXzLaQtFf7tCCCHKnI9xbjyljE9JAAAAAElFTkSuQmCC" />
            ) : (
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyA2djE4aDE4di0xOGgtMTh6bTUgMTRjMCAuNTUyLS40NDggMS0xIDFzLTEtLjQ0OC0xLTF2LTEwYzAtLjU1Mi40NDgtMSAxLTFzMSAuNDQ4IDEgMXYxMHptNSAwYzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xdi0xMGMwLS41NTIuNDQ4LTEgMS0xczEgLjQ0OCAxIDF2MTB6bTUgMGMwIC41NTItLjQ0OCAxLTEgMXMtMS0uNDQ4LTEtMXYtMTBjMC0uNTUyLjQ0OC0xIDEtMXMxIC40NDggMSAxdjEwem00LTE4djJoLTIwdi0yaDUuNzExYy45IDAgMS42MzEtMS4wOTkgMS42MzEtMmg1LjMxNWMwIC45MDEuNzMgMiAxLjYzMSAyaDUuNzEyeiIvPjwvc3ZnPg=="
                alt="trash"
              />
            )}
          </button>
        </td>
      </tr>
    );
  });

  return (
    <>
      {props.expensesList.length > 0 ? (
        <div className={classes.table__container}>
          <table className={classes.table}>
            <thead>
              <tr className={classes.table__tr}>
                <th className={classes.table__th}>Date</th>
                <th className={classes.table__th}>Expense Name</th>
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
        <p>No expenses matching search found.</p>
      )}
    </>
  );
};

export default ExpenseTable;