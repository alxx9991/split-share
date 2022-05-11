import { useReducer } from "react";
import { ExpenseFormActionType } from "../../enums/ExpenseFormActionType";
import cloneDeep from "lodash/cloneDeep";

type FormAction = {
  type: ExpenseFormActionType;
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
    case ExpenseFormActionType.SET_SPLIT_EVENLY:
      newState.splitEvenly.isSplitEvenly = action.payload.value;
      calculateUserSplit(newState);
      break;

    case ExpenseFormActionType.EXPENSE_NAME_CHANGED:
      newState.expenseName.expenseNameTouched = true;
      newState.expenseName.enteredExpenseName = action.payload.value;

      if (newState.expenseName.enteredExpenseName.trim().length > 0) {
        newState.expenseName.expenseNameValid = true;
      } else {
        newState.expenseName.expenseNameValid = false;
      }
      break;

    case ExpenseFormActionType.EXPENSE_NAME_BLURRED:
      newState.expenseName.expenseNameTouched = true;

      if (newState.expenseName.enteredExpenseName.trim().length > 0) {
        newState.expenseName.expenseNameValid = true;
      } else {
        newState.expenseName.expenseNameValid = false;
      }
      break;

    case ExpenseFormActionType.DATE_CHANGED:
      newState.date.dateTouched = true;
      newState.date.enteredDate = action.payload.value;

      if (newState.date.enteredDate.trim().length > 0) {
        newState.date.dateValid = true;
      } else {
        newState.date.dateValid = false;
      }
      break;

    case ExpenseFormActionType.DATE_BLURRED:
      newState.date.dateTouched = true;

      if (newState.date.enteredDate.trim().length > 0) {
        newState.date.dateValid = true;
      } else {
        newState.date.dateValid = false;
      }
      break;

    case ExpenseFormActionType.PAID_BY_CHANGED:
      newState.paidBy.paidByTouched = true;
      newState.paidBy.enteredPaidBy = action.payload.value;

      if (newState.paidBy.enteredPaidBy) {
        newState.paidBy.paidByValid = true;
      } else {
        newState.paidBy.paidByValid = false;
      }
      break;

    case ExpenseFormActionType.PAID_BY_BLURRED:
      newState.paidBy.paidByTouched = true;

      if (newState.paidBy.enteredPaidBy) {
        newState.paidBy.paidByValid = true;
      } else {
        newState.paidBy.paidByValid = false;
      }
      break;

    case ExpenseFormActionType.SHARED_BETWEEN_CHANGED:
      newState.sharedBetween.enteredSharedBetween = action.payload.value;
      newState.sharedBetween.sharedBetweenTouched = true;

      if (newState.sharedBetween.enteredSharedBetween.length > 0) {
        newState.sharedBetween.sharedBetweenValid = true;
      } else {
        newState.sharedBetween.sharedBetweenValid = false;
      }

      calculateUserSplit(newState);
      break;

    case ExpenseFormActionType.SHARED_BETWEEN_BLURRED:
      newState.sharedBetween.sharedBetweenTouched = true;

      if (newState.sharedBetween.enteredSharedBetween.length > 0) {
        newState.sharedBetween.sharedBetweenValid = true;
      } else {
        newState.sharedBetween.sharedBetweenValid = false;
      }
      break;

    case ExpenseFormActionType.AMOUNT_CHANGED:
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

    case ExpenseFormActionType.AMOUNT_BLURRED:
      newState.amount.amountTouched = true;

      if (newState.amount.enteredAmount > 0) {
        newState.amount.amountValid = true;
      } else {
        newState.amount.amountValid = false;
      }
      break;

    case ExpenseFormActionType.USER_SPLIT_CHANGED:
      newState.userSplit.userSplit.forEach((user) => {
        if (user[0] === action.payload.user) {
          user[1] = parseFloat(parseFloat(action.payload.value).toFixed(2));
          if (isNaN(user[1])) {
            user[1] = "";
          }
        }
      });
      break;

    case ExpenseFormActionType.SHOW_FORM:
      newState.formState.formShowing = true;
      break;

    case ExpenseFormActionType.HIDE_FORM:
      newState.formState.formShowing = false;
      break;

    case ExpenseFormActionType.FAILED_SUBMIT_EXPENSE:
      //Touch all fields
      newState.expenseName.expenseNameTouched = true;
      newState.date.dateTouched = true;
      newState.paidBy.paidByTouched = true;
      newState.sharedBetween.sharedBetweenTouched = true;
      newState.amount.amountTouched = true;
      break;

    case ExpenseFormActionType.SUBMIT_EXPENSE:
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

const useExpenseFormReducer = () => {
  //Hooks
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );

  return { formState, dispatchFormState };
};

export default useExpenseFormReducer;
