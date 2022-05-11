import classes from "./styles/Expenses.module.css";
import ExpenseForm from "./ExpenseForm";
import ExpensesList from "./ExpensesList";
import useFetchData from "../../hooks/useFetchData";
import { useEffect } from "react";
import Card from "../ui/Card";

const Expenses = () => {
  const { syncData, fetchIsLoading, fetchError } = useFetchData();
  useEffect(() => {
    syncData();
  }, [syncData]);

  return (
    <div className={classes.expenses}>
      {fetchIsLoading ? (
        <Card>Loading expenses...</Card>
      ) : fetchError ? (
        <Card>{fetchError}</Card>
      ) : (
        <>
          <ExpenseForm></ExpenseForm>
          <ExpensesList></ExpensesList>
        </>
      )}
    </div>
  );
};

export default Expenses;
