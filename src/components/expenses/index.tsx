import classes from "./styles/Expenses.module.css";
import ExpenseForm from "./ExpenseForm";
import ExpensesList from "./ExpensesList";

const Expenses: React.FC = () => {
  return (
    <div className={classes.expenses}>
      <ExpenseForm></ExpenseForm>
      <ExpensesList></ExpensesList>
    </div>
  );
};

export default Expenses;
