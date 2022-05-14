import Card from "../ui/Card";
import React, { useState } from "react";
import classes from "./styles/ExpensesList.module.css";
import ExpenseTable from "../ui/ExpenseTable";
import Select from "react-select";
import { StylesConfig } from "react-select";
import useData from "../../hooks/useData";

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
  //Hooks
  const [sortBy, setSortBy] = useState({
    label: "Latest Date",
    value: "Latest Date",
  });

  const [filterBy, setFilterBy] = useState("");

  const { expensesList: expenses } = useData();

  const sortByChangeHandler = (option: any) => {
    setSortBy(option!);
  };

  const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterBy(event.target.value);
  };

  //Generate sort options
  const sortOptionStrings: string[] = [
    "Latest Date",
    "Earliest Date",
    "Lowest Amount",
    "Highest Amount",
  ];

  const sortOptions: { label: string; value: string }[] = [];

  for (let optionString of sortOptionStrings) {
    sortOptions.push({ label: optionString, value: optionString });
  }

  //Generate list of expenses from expenses object
  let expensesList: Expense[] = [];

  if (expenses) {
    for (let expense of Object.values(expenses)) {
      expensesList.push(expense);
    }
  }

  //Sort table rows based on selected option
  switch (sortBy.value) {
    case "Earliest Date":
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

    case "Latest Date":
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

    case "Lowest Amount":
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

    case "Highest Amount":
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
              <ExpenseTable expensesList={expensesList}></ExpenseTable>
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
