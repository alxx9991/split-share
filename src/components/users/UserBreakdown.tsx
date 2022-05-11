import Select from "react-select";
import classes from "./UserBreakdown.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import ExpensesListSplit from "../expenses/ExpensesListSplit";
import { useDispatch } from "react-redux";
import { StylesConfig } from "react-select";
import useUpdateData from "../../hooks/useUpdateData";
import { useParams } from "react-router-dom";
import { UpdateType } from "../../enums/updateType";

//Select styling
const styles: StylesConfig = {
  control: (provided: any, state: any) => {
    return {
      ...provided,
      border: "1px solid #ccc",
      boxShadow: state.isFocused ? "0 0 0 1px var(--color-primary)" : "none",
      "&:hover": {
        boxShadow: "0 0 0 1px var(--color-primary)",
        border: "1px solid var(--color-primary)",
      },
    };
  },
};

const UserBreakdown: React.FC<{ selectedUser: User }> = (props) => {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const { updateDataReducer } = useUpdateData();

  let expenseList: Expense[] = [];

  for (let expense of Object.values(expenses)) {
    expenseList.push(expense);
  }

  const [paidByShowing, setPaidByShowing] = useState(true);
  const dispatch = useDispatch();
  const params = useParams();
  const filteredExpenseList = expenseList.filter((expense) => {
    if (paidByShowing) {
      return expense.paidBy === props.selectedUser.name;
    } else {
      return expense.splitBetween.some(
        (split) =>
          split[0] === props.selectedUser.name &&
          split[1] > 0 &&
          expense.paidBy !== props.selectedUser.name
      );
    }
  });

  //Handlers
  const deleteButtonClickHandler = (id: string) => {
    updateDataReducer(UpdateType.DELETE_EXPENSE, { expenseID: id });
  };

  const filterChangeHandler = (option: { label: string; value: string }) => {
    setPaidByShowing(option.value === `Paid by ${props.selectedUser.name}`);
  };

  const tableRows = filteredExpenseList.map((expense: Expense) => {
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
    <div className={classes["user-breakdown"]}>
      <h2>Breakdown</h2>
      <div className={classes["user-breakdown__contents"]}>
        <div className={classes["select-container"]}>
          <label htmlFor="filter-select">Filter: </label>
          <Select
            options={[
              {
                label: `Paid by ${props.selectedUser.name}`,
                value: `Paid by ${props.selectedUser.name}`,
              },
              {
                label: `Paid for ${props.selectedUser.name}`,
                value: `Paid for ${props.selectedUser.name}`,
              },
            ]}
            onChange={(option) => {
              filterChangeHandler(option as { label: string; value: string });
            }}
            value={
              paidByShowing
                ? {
                    label: `Paid by ${props.selectedUser.name}`,
                    value: `Paid by ${props.selectedUser.name}`,
                  }
                : {
                    label: `Paid for ${props.selectedUser.name}`,
                    value: `Paid for ${props.selectedUser.name}`,
                  }
            }
            styles={styles}
          ></Select>
        </div>
        {filteredExpenseList.length > 0 ? (
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
          <p>No expenses found.</p>
        )}
      </div>
    </div>
  );
};
export default UserBreakdown;
