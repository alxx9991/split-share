import Card from "../ui/Card";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import classes from "./ExpensesList.module.css";
import ExpensesListSplit from "./ExpensesListSplit";
import Select from "react-select";
import { StylesConfig } from "react-select";
import useUpdateData from "../../hooks/useUpdateData";
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

const ExpensesList = () => {
  const [loadingDelete, setLoadingDelete] = useState("");

  const { updateDataReducer } = useUpdateData();

  //Hooks
  const [sortBy, setSortBy] = useState({
    label: "Date Latest First",
    value: "Date Latest First",
  });

  const [filterBy, setFilterBy] = useState("");

  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  //Handlers
  const deleteButtonClickHandler = async (id: string) => {
    setLoadingDelete(id);
    await updateDataReducer(UpdateType.DELETE_EXPENSE, { expenseID: id });
    setLoadingDelete("");
  };

  const sortByChangeHandler = (option: any) => {
    setSortBy(option!);
  };

  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterBy(event.target.value);
  };

  //Generate sort options
  const sortOptionStrings: string[] = [
    "Date Latest First",
    "Date Earliest First",
    "Lowest Amount First",
    "Highest Amount First",
  ];

  const sortOptions: { label: string; value: string }[] = [];

  for (let optionString of sortOptionStrings) {
    sortOptions.push({ label: optionString, value: optionString });
  }

  //Generate list of expenses from expenses object
  let expensesList: Expense[] = [];

  for (let expense of Object.values(expenses)) {
    expensesList.push(expense);
  }

  //Sort table rows based on selected option
  switch (sortBy.value) {
    case "Name A-Z":
      expensesList.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      break;

    case "Name Z-A":
      expensesList.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      break;

    case "Date Earliest First":
      expensesList.sort((a, b) => {
        const [aYear, aMonth, aDay] = a.date
          .split("-")
          .map((str) => parseInt(str));
        const [bYear, bMonth, bDay] = b.date
          .split("-")
          .map((str) => parseInt(str));
        const aDate = new Date(aYear, aMonth - 1, aDay);
        const bDate = new Date(bYear, bMonth - 1, bDay);
        if (aDate < bDate) {
          return -1;
        }
        if (aDate > bDate) {
          return 1;
        }
        return 0;
      });
      break;

    case "Date Latest First":
      expensesList.sort((a, b) => {
        const [aYear, aMonth, aDay] = a.date
          .split("-")
          .map((str) => parseInt(str));
        const [bYear, bMonth, bDay] = b.date
          .split("-")
          .map((str) => parseInt(str));
        const aDate = new Date(aYear, aMonth - 1, aDay);
        const bDate = new Date(bYear, bMonth - 1, bDay);
        if (aDate < bDate) {
          return 1;
        }
        if (aDate > bDate) {
          return -1;
        }
        return 0;
      });
      break;

    case "Lowest Amount First":
      expensesList.sort((a, b) => {
        if (a.amount < b.amount) {
          return -1;
        }
        if (a.amount > b.amount) {
          return 1;
        }
        return 0;
      });
      break;

    case "Highest Amount First":
      expensesList.sort((a, b) => {
        if (a.amount < b.amount) {
          return 1;
        }
        if (a.amount > b.amount) {
          return -1;
        }
        return 0;
      });
      break;

    case "Paid By A-Z":
      expensesList.sort((a, b) => {
        if (a.paidBy.toLowerCase() < b.paidBy.toLowerCase()) {
          return -1;
        }
        if (a.paidBy.toLowerCase() > b.paidBy.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      break;

    case "Paid By Z-A":
      expensesList.sort((a, b) => {
        if (a.paidBy.toLowerCase() > b.paidBy.toLowerCase()) {
          return -1;
        }
        if (a.paidBy.toLowerCase() < b.paidBy.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      break;

    default:
      console.error("Invalid sort option");
      break;
  }

  //Filter local expenses list based on filter text
  if (filterBy !== "") {
    expensesList = expensesList.filter((expense) => {
      if (expense.amount.toString().includes(filterBy)) {
        return true;
      }
      if (expense.name.includes(filterBy)) {
        return true;
      }

      if (expense.date.includes(filterBy)) {
        return true;
      }

      if (expense.paidBy.includes(filterBy)) {
        return true;
      }

      return false;
    });
  }

  const tableRows = expensesList.map((expense: Expense) => {
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
              loadingDelete === expense.id
                ? classes["table__button--loading"]
                : classes.table__button
            }
            onClick={() => {
              if (loadingDelete !== expense.id) {
                deleteButtonClickHandler(expense.id);
              }
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
        <div className={classes["expense-list__inner"]}>
          <h2>Expense List</h2>
          {false ? (
            <p className={classes["no-expenses"]}>Loading expenses...</p>
          ) : false ? (
            <p className={classes["no-expenses"]}>{false}</p>
          ) : expensesList.length > 0 ? (
            <>
              <div className={classes["filter-container"]}>
                <div className={classes["search-container"]}>
                  <label htmlFor="search">Search</label>
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={searchChangeHandler}
                  />
                </div>
                <div className={classes["select-container"]}>
                  <label htmlFor="sort-by">Sort By</label>
                  <Select
                    options={sortOptions}
                    value={sortBy}
                    styles={styles}
                    onChange={(option) => {
                      sortByChangeHandler(option);
                    }}
                  ></Select>
                </div>
              </div>
              {expensesList.length > 0 ? (
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
          ) : (
            <p className={classes["no-expenses"]}>No expenses added yet</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExpensesList;
