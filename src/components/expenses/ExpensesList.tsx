import Card from "../ui/Card";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { v4 as uuidv4 } from "uuid";
import classes from "./ExpensesList.module.css";

const ExpensesList = () => {
  const expensesList = useSelector(
    (state: RootState) => state.expenses.expenses
  );

  const expenseList = (
    <ul className={classes["expense-list__list"]}>
      {expensesList.map((expense: Expense) => {
        return (
          <li className={classes["expense-list__list--li"]} key={expense.id}>
            <h5 className={classes["expense-list__item-heading"]}>
              {expense.name}
            </h5>
            <p>
              <span className={classes["expense-list__list--li__heading"]}>
                Expense Amount:{" "}
              </span>
              ${expense.amount}
            </p>
            <p>
              <span className={classes["expense-list__list--li__heading"]}>
                Paid By:{" "}
              </span>
              {expense.paidBy}
            </p>
            <ul>
              <span className={classes["expense-list__list--li__heading"]}>
                Split Between:{" "}
              </span>
              {expense.splitBetween.map((userSplit: UserSplit) => {
                return (
                  <li key={uuidv4()}>
                    {userSplit[0]}: ${userSplit[1]}
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={classes["expense-list"]}>
      <Card>
        <h2>Expense List</h2>
        {expenseList}
      </Card>
    </div>
  );
};

export default ExpensesList;
