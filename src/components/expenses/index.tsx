import classes from "./Expenses.module.css";
import ExpenseForm from "./ExpenseForm";
import ExpensesList from "./ExpensesList";
import { useParams } from "react-router-dom";

const Expenses = () => {
  const params = useParams();

  return (
    <div className={classes.expenses}>
      <ExpenseForm></ExpenseForm>
      <ExpensesList></ExpensesList>
    </div>
  );
};

export default Expenses;
