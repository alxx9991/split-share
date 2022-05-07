import classes from "./ExpenseForm.module.css";

import { useReducer, Reducer, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";

import { RootState } from "../../store";
import { expenseActions } from "../../store/expenseReducer";
import useHTTP from "../../hooks/useHTTP";

import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import Select from "../ui/Select";
import ExpenseSplitter from "./ExpenseSplitter";

enum FormActionType {
  SET_SPLIT_EVENLY,
  EXPENSE_NAME_CHANGED,
  EXPENSE_NAME_BLURRED,
  DATE_CHANGED,
  DATE_BLURRED,
  PAID_BY_CHANGED,
  PAID_BY_BLURRED,
  SHARED_BETWEEN_CHANGED,
  SHARED_BETWEEN_BLURRED,
  AMOUNT_CHANGED,
  AMOUNT_BLURRED,
  USER_SPLIT_CHANGED,
  SHOW_FORM,
  HIDE_FORM,
  SUBMIT_EXPENSE,
  FAILED_SUBMIT_EXPENSE,
}

type FormAction = {
  type: FormActionType;
  payload: any;
};

type FormState = {
  splitEvenly: {
    isSplitEvenly: boolean;
  };

  expenseName: {
    enteredExpenseName: string;
    expenseNameTouched: boolean;
    expenseNameValid: boolean;
  };

  date: {
    enteredDate: string;
    dateTouched: boolean;
    dateValid: boolean;
  };

  paidBy: {
    enteredPaidBy: { label: string; value: string } | null;
    paidByTouched: boolean;
    paidByValid: boolean;
  };

  sharedBetween: {
    enteredSharedBetween: { label: string; value: string }[];
    sharedBetweenTouched: boolean;
    sharedBetweenValid: boolean;
  };

  amount: {
    enteredAmount: number | string;
    amountTouched: boolean;
    amountValid: boolean;
  };

  userSplit: {
    userSplit: UserSplit[];
  };

  formState: {
    formShowing: boolean;
  };
};

const calculateUserSplit = (newState: FormState) => {
  //If amount and shared between is filled in, and split evenly is checked, distribute the amount evenly
  if (
    newState.splitEvenly.isSplitEvenly &&
    typeof newState.amount.enteredAmount === "number" &&
    newState.sharedBetween.enteredSharedBetween.length > 0
  ) {
    //Redistribute the amount among the remaining users
    const amount = newState.amount.enteredAmount;
    const users: string[] = newState.sharedBetween.enteredSharedBetween.map(
      (user) => user.value
    );
    const userSplit: UserSplit[] = users.map((user: string) => {
      return [user, parseFloat((amount / users.length).toFixed(2))];
    });
    const last = userSplit.pop();
    const remaining =
      amount -
      userSplit.reduce((acc, curr) => {
        return acc + (curr[1] as number);
      }, 0);
    userSplit.push([last![0], parseFloat(remaining.toFixed(2))]);
    newState.userSplit.userSplit = userSplit;
    return newState;
  }

  //If the amount is not entered but the users are entered, then generate empty inputs for the users
  if (
    typeof newState.amount.enteredAmount === "string" &&
    newState.sharedBetween.enteredSharedBetween.length > 0
  ) {
    const users = newState.sharedBetween.enteredSharedBetween;
    const userSplit: UserSplit[] = users.map(
      (user: { label: string; value: string }) => {
        return [user.value, ""];
      }
    );
    newState.userSplit.userSplit = userSplit;
    return newState;
  }

  //If there are no users entered, then we have an empty user split
  if (newState.sharedBetween.enteredSharedBetween.length === 0) {
    newState.userSplit.userSplit = [];
    return newState;
  }

  //If not splitting evenly, update the user split based on the existing user split
  if (!newState.splitEvenly.isSplitEvenly) {
    const newUserSplit: UserSplit[] = [];
    for (let user of newState.sharedBetween.enteredSharedBetween) {
      //Try to find the user in the userSplit
      const userSplitIndex = newState.userSplit.userSplit.findIndex(
        (userSplit) => {
          return userSplit[0] === user.value;
        }
      );

      //If the user is not in the userSplit, add it
      if (userSplitIndex === -1) {
        newUserSplit.push([user.value, ""]);
      }

      //If the user is in the userSplit, add it to the newUserSplit and use its value from the userSplit
      else {
        newUserSplit.push([
          user.value,
          newState.userSplit.userSplit[userSplitIndex][1],
        ]);
      }
    }
    newState.userSplit.userSplit = newUserSplit;
    return newState;
  }

  return newState;
};

const formReducer: Reducer<FormState, FormAction> = (
  state: FormState,
  action: FormAction
) => {
  const newState = cloneDeep(state);

  switch (action.type) {
    case FormActionType.SET_SPLIT_EVENLY:
      newState.splitEvenly.isSplitEvenly = action.payload.value;
      calculateUserSplit(newState);
      break;

    case FormActionType.EXPENSE_NAME_CHANGED:
      newState.expenseName.expenseNameTouched = true;
      newState.expenseName.enteredExpenseName = action.payload.value;

      if (newState.expenseName.enteredExpenseName.trim().length > 0) {
        newState.expenseName.expenseNameValid = true;
      } else {
        newState.expenseName.expenseNameValid = false;
      }
      break;

    case FormActionType.EXPENSE_NAME_BLURRED:
      newState.expenseName.expenseNameTouched = true;

      if (newState.expenseName.enteredExpenseName.trim().length > 0) {
        newState.expenseName.expenseNameValid = true;
      } else {
        newState.expenseName.expenseNameValid = false;
      }
      break;

    case FormActionType.DATE_CHANGED:
      newState.date.dateTouched = true;
      newState.date.enteredDate = action.payload.value;

      if (newState.date.enteredDate.trim().length > 0) {
        newState.date.dateValid = true;
      } else {
        newState.date.dateValid = false;
      }
      break;

    case FormActionType.DATE_BLURRED:
      newState.date.dateTouched = true;

      if (newState.date.enteredDate.trim().length > 0) {
        newState.date.dateValid = true;
      } else {
        newState.date.dateValid = false;
      }
      break;

    case FormActionType.PAID_BY_CHANGED:
      newState.paidBy.paidByTouched = true;
      newState.paidBy.enteredPaidBy = action.payload.value;

      if (newState.paidBy.enteredPaidBy) {
        newState.paidBy.paidByValid = true;
      } else {
        newState.paidBy.paidByValid = false;
      }
      break;

    case FormActionType.PAID_BY_BLURRED:
      newState.paidBy.paidByTouched = true;

      if (newState.paidBy.enteredPaidBy) {
        newState.paidBy.paidByValid = true;
      } else {
        newState.paidBy.paidByValid = false;
      }
      break;

    case FormActionType.SHARED_BETWEEN_CHANGED:
      newState.sharedBetween.enteredSharedBetween = action.payload.value;
      newState.sharedBetween.sharedBetweenTouched = true;

      if (newState.sharedBetween.enteredSharedBetween.length > 0) {
        newState.sharedBetween.sharedBetweenValid = true;
      } else {
        newState.sharedBetween.sharedBetweenValid = false;
      }

      calculateUserSplit(newState);
      break;

    case FormActionType.SHARED_BETWEEN_BLURRED:
      newState.sharedBetween.sharedBetweenTouched = true;

      if (newState.sharedBetween.enteredSharedBetween.length > 0) {
        newState.sharedBetween.sharedBetweenValid = true;
      } else {
        newState.sharedBetween.sharedBetweenValid = false;
      }
      break;

    case FormActionType.AMOUNT_CHANGED:
      newState.amount.enteredAmount = parseFloat(
        parseFloat(action.payload.value).toFixed(2)
      );

      if (isNaN(newState.amount.enteredAmount)) {
        newState.amount.enteredAmount = "";
      }

      newState.amount.amountTouched = true;

      if (newState.amount.enteredAmount > 0) {
        newState.amount.amountValid = true;
      } else {
        newState.amount.amountValid = false;
      }

      calculateUserSplit(newState);
      break;

    case FormActionType.AMOUNT_BLURRED:
      newState.amount.amountTouched = true;

      if (newState.amount.enteredAmount > 0) {
        newState.amount.amountValid = true;
      } else {
        newState.amount.amountValid = false;
      }
      break;

    case FormActionType.USER_SPLIT_CHANGED:
      newState.userSplit.userSplit.forEach((user) => {
        if (user[0] === action.payload.user) {
          user[1] = parseFloat(parseFloat(action.payload.value).toFixed(2));
          if (isNaN(user[1])) {
            user[1] = "";
          }
        }
      });
      break;

    case FormActionType.SHOW_FORM:
      newState.formState.formShowing = true;
      break;

    case FormActionType.HIDE_FORM:
      newState.formState.formShowing = false;
      break;

    case FormActionType.FAILED_SUBMIT_EXPENSE:
      //Touch all fields
      newState.expenseName.expenseNameTouched = true;
      newState.date.dateTouched = true;
      newState.paidBy.paidByTouched = true;
      newState.sharedBetween.sharedBetweenTouched = true;
      newState.amount.amountTouched = true;
      break;

    case FormActionType.SUBMIT_EXPENSE:
      //Clear all fields
      newState.expenseName.expenseNameTouched = false;
      newState.expenseName.expenseNameValid = false;
      newState.expenseName.enteredExpenseName = "";
      newState.amount.amountTouched = false;
      newState.amount.amountValid = false;
      newState.amount.enteredAmount = "";
      newState.date.dateTouched = false;
      newState.date.dateValid = false;
      newState.date.enteredDate = "";
      newState.paidBy.paidByTouched = false;
      newState.paidBy.paidByValid = false;
      newState.paidBy.enteredPaidBy = null;
      newState.sharedBetween.sharedBetweenTouched = false;
      newState.sharedBetween.sharedBetweenValid = false;
      newState.sharedBetween.enteredSharedBetween = [];
      newState.userSplit.userSplit = [];
      newState.formState.formShowing = false;
      break;

    default:
      console.error("Unknown action type in formReducer");
  }

  return newState;
};

const initialFormState: FormState = {
  splitEvenly: {
    isSplitEvenly: true,
  },
  expenseName: {
    enteredExpenseName: "",
    expenseNameTouched: false,
    expenseNameValid: false,
  },
  date: {
    enteredDate: "",
    dateTouched: false,
    dateValid: false,
  },
  paidBy: {
    enteredPaidBy: null,
    paidByTouched: false,
    paidByValid: false,
  },
  sharedBetween: {
    enteredSharedBetween: [],
    sharedBetweenTouched: false,
    sharedBetweenValid: false,
  },
  amount: {
    enteredAmount: "",
    amountTouched: false,
    amountValid: false,
  },
  userSplit: {
    userSplit: [],
  },
  formState: {
    formShowing: false,
  },
};

const ExpenseForm = () => {
  //Hooks
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );
  const dispatch = useDispatch();

  const amountInputRef = useRef<HTMLInputElement>(null);
  const userList = useSelector((state: RootState) => state.users.users);
  const { isLoading, setIsLoading, post, get, error, setError } = useHTTP();

  //Handlers
  const addExpenseClickHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();

    //If form is not showing, then show the form
    if (!formState.formState.formShowing) {
      dispatchFormState({
        type: FormActionType.SHOW_FORM,
        payload: {},
      });
      return;
    }

    //If the form is not valid, then dispatch the failed submit action
    if (!entireFormValid) {
      dispatchFormState({
        type: FormActionType.FAILED_SUBMIT_EXPENSE,
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

    for (let user of userList) {
      //If user is not in sanitized user split, add that user with amount 0
      if (
        sanitizedUserSplit.find((userInSplit) => {
          return user.name === userInSplit[0];
        }) === undefined
      ) {
        sanitizedUserSplit.push([user.name, 0]);
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

    post(
      "https://split-share-89844-default-rtdb.asia-southeast1.firebasedatabase.app/documents/-N1Rakmx45ffugn0ymdi/data/expenses.json",
      expense
    )
      .then(() => {
        dispatch(expenseActions.addExpenseReducer({ expense }));
        //Dispatch action to clear form
        dispatchFormState({
          type: FormActionType.SUBMIT_EXPENSE,
          payload: {
            valid: entireFormValid,
          },
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
        setIsLoading(false);
      });
  };

  const cancelButtonClickHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    dispatchFormState({
      type: FormActionType.HIDE_FORM,
      payload: {},
    });
  };

  const expenseNameChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: FormActionType.EXPENSE_NAME_CHANGED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const expenseNameBlurHandler: React.FocusEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: FormActionType.EXPENSE_NAME_BLURRED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const splitEvenlyHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: FormActionType.SET_SPLIT_EVENLY,
      payload: {
        value: event.target.checked,
      },
    });
  };

  const dateChangeHander: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: FormActionType.DATE_CHANGED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const dateBlurHander: React.FocusEventHandler<HTMLInputElement> = (event) => {
    dispatchFormState({
      type: FormActionType.DATE_BLURRED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const paidByChangeHandler = (
    option: { label: string; value: string } | null
  ) => {
    dispatchFormState({
      type: FormActionType.PAID_BY_CHANGED,
      payload: {
        value: option ? option : null,
      },
    });
  };

  const paidByBlurHandler = (event: any) => {
    dispatchFormState({
      type: FormActionType.PAID_BY_BLURRED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const sharedBetweenChangeHandler = (
    option: readonly { label: string; value: string }[]
  ) => {
    dispatchFormState({
      type: FormActionType.SHARED_BETWEEN_CHANGED,
      payload: {
        value: option,
      },
    });
  };

  const sharedBetweenBlurHandler = (event: any) => {
    dispatchFormState({
      type: FormActionType.SHARED_BETWEEN_BLURRED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const expenseAmountChangeHandler: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    dispatchFormState({
      type: FormActionType.AMOUNT_CHANGED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const expenseAmountBlurHandler: React.FocusEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: FormActionType.AMOUNT_BLURRED,
      payload: {
        value: event.target.value,
      },
    });
  };

  const expenseSplitterInputChangeHandler = (event: any, user: string) => {
    dispatchFormState({
      type: FormActionType.USER_SPLIT_CHANGED,
      payload: {
        user,
        value: event.target.value,
      },
    });
  };

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
              onClick={addExpenseClickHandler}
              inactive={
                formState.formState.formShowing && !entireFormValid
                  ? true
                  : false
              }
            >
              Add Expense
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ExpenseForm;
