import Select from "react-select";
import classes from "./styles/UserBreakdown.module.css";
import { useState } from "react";
import { StylesConfig } from "react-select";
import ExpenseTable from "../ui/ExpenseTable";
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

const UserBreakdown: React.FC<{ selectedUser: User }> = (props) => {
  const { expensesList: expenseList } = useData();

  const [paidByShowing, setPaidByShowing] = useState(true);

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

  const filterChangeHandler = (option: { label: string; value: string }) => {
    setPaidByShowing(option.value === `Paid by ${props.selectedUser.name}`);
  };

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
          <ExpenseTable expensesList={filteredExpenseList}></ExpenseTable>
        ) : (
          <p>No expenses found.</p>
        )}
      </div>
    </div>
  );
};
export default UserBreakdown;
