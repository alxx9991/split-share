import classes from "./styles/ExpenseForm.module.css";

import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import Select from "../ui/Select";
import ExpenseSplitter from "./ExpenseSplitter";

import useExpenseForm from "../../hooks/expenseFormHooks/useExpenseForm";

const ExpenseForm = () => {
  const {
    handlers,
    formState,
    updating,
    valid,
    userList,
    amountInputRef,
    unallocated,
  } = useExpenseForm();

  const {
    expenseNameChangeHandler,
    expenseNameBlurHandler,
    dateChangeHander,
    dateBlurHander,
    paidByChangeHandler,
    paidByBlurHandler,
    sharedBetweenChangeHandler,
    sharedBetweenBlurHandler,
    expenseAmountChangeHandler,
    expenseAmountBlurHandler,
    splitEvenlyHandler,
    expenseSplitterInputChangeHandler,
    cancelButtonClickHandler,
    addExpenseClickHandler,
  } = handlers;

  const { updateIsLoading, updateError } = updating;

  const {
    entireFormValid,
    expenseNameInputValid,
    dateInputValid,
    paidByInputValid,
    amountInputValid,
    sharedBetweenInputValid,
  } = valid;

  return (
    <div className={classes["expense-form"]}>
      <Card>
        <form action="">
          {formState.formState.formShowing && (
            <>
              <Input
                attributes={{
                  type: "text",
                  id: "expense-name",
                  onChange: expenseNameChangeHandler,
                  onBlur: expenseNameBlurHandler,
                  value: formState.expenseName.enteredExpenseName,
                }}
                label={"Expense Name"}
                errorMessage={"Required field"}
                valid={expenseNameInputValid}
              />
              <Input
                attributes={{
                  type: "date",
                  id: "expense-date",
                  onChange: dateChangeHander,
                  onBlur: dateBlurHander,
                  value: formState.date.enteredDate,
                }}
                label={"Date"}
                errorMessage={"Required field"}
                valid={dateInputValid}
              />
              <Select
                onChange={paidByChangeHandler}
                onBlur={paidByBlurHandler}
                userList={userList}
                isClearable
                id="paid-by"
                valid={paidByInputValid}
                errorText={"Required field"}
                label={"Paid By"}
                value={formState.paidBy.enteredPaidBy}
              />
              <Select
                userList={userList}
                onChange={sharedBetweenChangeHandler}
                onBlur={sharedBetweenBlurHandler}
                isMulti
                errorText={"Required Field"}
                label={"Shared Between"}
                valid={sharedBetweenInputValid}
                id={"shared-between"}
                value={formState.sharedBetween.enteredSharedBetween}
              />
              <Input
                attributes={{
                  type: "number",
                  id: "expense-amount",
                  onChange: expenseAmountChangeHandler,
                  onBlur: expenseAmountBlurHandler,
                  value: formState.amount.enteredAmount,
                  step: "0.01",
                }}
                label={"Expense Amount"}
                ref={amountInputRef}
                errorMessage={
                  amountInputRef.current
                    ? parseInt(amountInputRef.current!.value) <= 0
                      ? "Must greater than 0"
                      : "Required field"
                    : "Required field"
                }
                valid={amountInputValid}
              />
              <Checkbox
                attributes={{
                  onChange: splitEvenlyHandler,
                  type: "checkbox",
                  id: "split-evenly",
                  checked: formState.splitEvenly.isSplitEvenly,
                }}
                label={"Split Evenly"}
              />
              <ExpenseSplitter
                isSplitEvenly={formState.splitEvenly.isSplitEvenly}
                splitBetween={formState.userSplit.userSplit}
                amount={formState.amount.enteredAmount}
                unallocated={unallocated}
                expenseSplitterInputChangeHandler={
                  expenseSplitterInputChangeHandler
                }
              ></ExpenseSplitter>
            </>
          )}
          <div className={classes["expense-form__buttons"]}>
            {formState.formState.formShowing && (
              <Button onClick={cancelButtonClickHandler}>Cancel</Button>
            )}
            <Button
              onClick={
                false
                  ? (e) => {
                      e.preventDefault();
                    }
                  : addExpenseClickHandler
              }
              inactive={
                (formState.formState.formShowing && !entireFormValid) ||
                updateIsLoading
                  ? true
                  : false
              }
            >
              {updateIsLoading
                ? "Adding..."
                : updateError
                ? "Retry?"
                : "Add Expense"}
            </Button>
          </div>
        </form>
        {updateError && (
          <p className={classes["expense-form__update-error-text"]}>
            Failed to add expense: {updateError}
          </p>
        )}
      </Card>
    </div>
  );
};

export default ExpenseForm;
