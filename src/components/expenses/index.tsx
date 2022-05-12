import classes from "./styles/Expenses.module.css";
import ExpenseForm from "./ExpenseForm";
import ExpensesList from "./ExpensesList";
import useFetchData from "../../hooks/useFetchData";
import { useEffect } from "react";
import Loading from "../ui/Loading";

const Expenses = () => {
  const { syncData, fetchIsLoading, fetchError } = useFetchData();
  useEffect(() => {
    syncData();
  }, [syncData]);

  return (
    <div className={classes.expenses}>
      {fetchIsLoading || fetchError ? (
        <Loading
          loadingMessage={"Loading expenses..."}
          errorMessage={fetchError ? fetchError : ""}
          syncData={syncData}
          fetchIsLoading={fetchIsLoading}
        ></Loading>
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
