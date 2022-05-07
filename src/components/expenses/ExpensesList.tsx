import Card from "../ui/Card";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import classes from "./ExpensesList.module.css";
import ExpensesListSplit from "./ExpensesListSplit";
import { expenseActions } from "../../store/expenseReducer";
import Select from "react-select";
import { cloneDeep } from "lodash";
import { StylesConfig } from "react-select";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useHTTP from "../../hooks/useHTTP";
import { globalActions } from "../../store/globalReducer";
import { userActions } from "../../store/userReducer";
import { v4 as uuidv4 } from "uuid";

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
  const params = useParams();
  const existingDocID = useSelector((state: RootState) => state.global.docID);

  const { isLoading, setIsLoading, error, setError, get, post } = useHTTP();
  const dispatch = useDispatch();
  useEffect(() => {
    //Attempt to fetch the document
    get(
      `https://split-share-89844-default-rtdb.asia-southeast1.firebasedatabase.app/documents/${params.docID}.json`
    )
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        //If we cannot find the document, set error
        if (!res.data) {
          setError(
            "Error 404: Resource not found, please check that the URL is correct."
          );
        } else {
          //Else, switch documents to the new document
          //Set the global doc id
          dispatch(
            globalActions.changedocumentIDReducer({ docID: params.docID })
          );
          //Set the expenses
          dispatch(
            expenseActions.setExpensesReducer({
              expenses: res.data.expenses ? res.data.expenses : [],
            })
          );

          //Set the users
          dispatch(
            userActions.setUsersReducer({
              users: res.data.users
                ? res.data.users
                : [
                    {
                      id: uuidv4(),
                      name: "alex",
                      paymentDetails: "Beem: @alxx9991",
                    },
                    {
                      id: uuidv4(),
                      name: "anna",
                      paymentDetails: "Beem: @aznna",
                    },
                    {
                      id: uuidv4(),
                      name: "kevin",
                      paymentDetails: "Beem: @kevinnli",
                    },
                  ],
            })
          );
        }
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        console.error(err);
      });
  }, [get, params.docID, existingDocID, setIsLoading, setError, dispatch]);

  //Hooks
  const [sortBy, setSortBy] = useState({
    label: "Date Latest First",
    value: "Date Latest First",
  });

  const [filterBy, setFilterBy] = useState("");

  const expensesList = useSelector(
    (state: RootState) => state.expenses.expenses
  );

  //Handlers
  const deleteButtonClickHandler = (id: string) => {
    dispatch(expenseActions.removeExpenseReducer({ id }));
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

  //Clone expenses list so we are not modifying the original
  let localExpensesList = cloneDeep(expensesList);

  //Sort table rows based on selected option
  switch (sortBy.value) {
    case "Name A-Z":
      localExpensesList.sort((a, b) => {
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
      localExpensesList.sort((a, b) => {
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
      localExpensesList.sort((a, b) => {
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
      localExpensesList.sort((a, b) => {
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
      localExpensesList.sort((a, b) => {
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
      localExpensesList.sort((a, b) => {
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
      localExpensesList.sort((a, b) => {
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
      localExpensesList.sort((a, b) => {
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
    localExpensesList = localExpensesList.filter((expense) => {
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

  const tableRows = localExpensesList.map((expense: Expense) => {
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
    <div className={classes["expense-list"]}>
      <Card>
        <div className={classes["expense-list__inner"]}>
          <h2>Expense List</h2>
          {isLoading ? (
            <p className={classes["no-expenses"]}>Loading expenses...</p>
          ) : error ? (
            <p className={classes["no-expenses"]}>{error}</p>
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
              {localExpensesList.length > 0 ? (
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
