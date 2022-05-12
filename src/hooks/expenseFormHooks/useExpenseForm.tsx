import useExpenseFormReducer from "./useExpenseFormReducer";
import { useRef } from "react";
import useUpdateData from "../useUpdateData";
import { UpdateType } from "../../enums/updateType";
import { ExpenseFormActionType } from "../../enums/ExpenseFormActionType";
import { v4 as uuidv4 } from "uuid";
import useData from "../useData";

const useExpenseFormHandlers = () => {
  //Hooks
  const {
    isLoading: updateIsLoading,
    setIsLoading: setUpdateIsLoading,
    error: updateError,
    updateDataReducer,
  } = useUpdateData();

  const amountInputRef = useRef<HTMLInputElement>(null);

  const { formState, dispatchFormState } = useExpenseFormReducer();

  const { usersList: userList } = useData();

  //Validation logic
  const expenseNameInputValid =
    !formState.expenseName.expenseNameTouched ||
    formState.expenseName.expenseNameValid;

  const dateInputValid =
    !formState.date.dateTouched || formState.date.dateValid;

  const paidByInputValid =
    !formState.paidBy.paidByTouched || formState.paidBy.paidByValid;

  const sharedBetweenInputValid =
    !formState.sharedBetween.sharedBetweenTouched ||
    formState.sharedBetween.sharedBetweenValid;

  const amountInputValid =
    !formState.amount.amountTouched || formState.amount.amountValid;

  let unallocated: number | string;

  if (
    typeof formState.amount.enteredAmount === "number" &&
    formState.amount.enteredAmount > 0
  ) {
    unallocated = parseFloat(
      (
        formState.amount.enteredAmount -
        formState.userSplit.userSplit.reduce((acc, curr) => {
          if (curr[1] === "") {
            return acc;
          }
          return acc + (curr[1] as number);
        }, 0)
      ).toFixed(2)
    );
  } else {
    unallocated = "";
  }

  const entireFormValid =
    expenseNameInputValid &&
    dateInputValid &&
    paidByInputValid &&
    sharedBetweenInputValid &&
    amountInputValid &&
    unallocated === 0;

  //Handlers
  const addExpenseClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = async (event) => {
    event.preventDefault();

    //If form is not showing, then show the form
    if (!formState.formState.formShowing) {
      dispatchFormState({
        type: ExpenseFormActionType.SHOW_FORM,
        payload: {},
      });
      return;
    }

    //If the form is not valid, then dispatch the failed submit action
    if (!entireFormValid) {
      dispatchFormState({
        type: ExpenseFormActionType.FAILED_SUBMIT_EXPENSE,
        payload: {},
      });
      return;
    }

    //Attempt to send the data to the server
    const sanitizedUserSplit: UserSplit[] = [];
    for (let user of formState.userSplit.userSplit) {
      if (typeof user[1] === "number") {
        sanitizedUserSplit.push(user);
      }
    }

    const expense: Expense = {
      id: uuidv4(),
      name: formState.expenseName.enteredExpenseName,
      date: formState.date.enteredDate.split("-").reverse().join("-"),
      paidBy: formState.paidBy.enteredPaidBy!.value,
      splitBetween: sanitizedUserSplit,
      amount: formState.amount.enteredAmount as number,
    };

    const addSuccessful = await updateDataReducer(UpdateType.ADD_EXPENSE, {
      expense,
    });

    if (addSuccessful) {
      dispatchFormState({
        type: ExpenseFormActionType.SUBMIT_EXPENSE,
        payload: {},
      });
    }
    setUpdateIsLoading(false);
  };

  const cancelButtonClickHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    dispatchFormState({
      type: ExpenseFormActionType.HIDE_FORM,
      payload: {},
    });
  };

  const expenseNameChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: ExpenseFormActionType.EXPENSE_NAME_CHANGED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const expenseNameBlurHandler: React.FocusEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: ExpenseFormActionType.EXPENSE_NAME_BLURRED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const splitEvenlyHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: ExpenseFormActionType.SET_SPLIT_EVENLY,
      payload: {
        value: event.target.checked,
      },
    });
  };

  const dateChangeHander: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: ExpenseFormActionType.DATE_CHANGED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const dateBlurHander: React.FocusEventHandler<HTMLInputElement> = (event) => {
    dispatchFormState({
      type: ExpenseFormActionType.DATE_BLURRED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const paidByChangeHandler = (
    option: { label: string; value: string } | null
  ) => {
    dispatchFormState({
      type: ExpenseFormActionType.PAID_BY_CHANGED,
      payload: {
        value: option ? option : null,
      },
    });
  };

  const paidByBlurHandler = (event: any) => {
    dispatchFormState({
      type: ExpenseFormActionType.PAID_BY_BLURRED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const sharedBetweenChangeHandler = (
    option: readonly { label: string; value: string }[]
  ) => {
    dispatchFormState({
      type: ExpenseFormActionType.SHARED_BETWEEN_CHANGED,
      payload: {
        value: option,
      },
    });
  };

  const sharedBetweenBlurHandler = (event: any) => {
    dispatchFormState({
      type: ExpenseFormActionType.SHARED_BETWEEN_BLURRED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const expenseAmountChangeHandler: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    dispatchFormState({
      type: ExpenseFormActionType.AMOUNT_CHANGED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const expenseAmountBlurHandler: React.FocusEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: ExpenseFormActionType.AMOUNT_BLURRED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const expenseSplitterInputChangeHandler = (event: any, user: string) => {
    dispatchFormState({
      type: ExpenseFormActionType.USER_SPLIT_CHANGED,
      payload: {
        user,
        value: event.target.value,
      },
    });
  };

  return {
    handlers: {
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
    },
    formState,
    updating: {
      updateIsLoading,
      updateError,
    },
    valid: {
      entireFormValid,
      expenseNameInputValid,
      dateInputValid,
      paidByInputValid,
      amountInputValid,
      sharedBetweenInputValid,
    },
    userList,
    amountInputRef,
    unallocated,
  };
};

export default useExpenseFormHandlers;
