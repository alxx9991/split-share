import UserProfile from "./UserProfile";
import UserSummary from "./UserSummary";
import UserBreakdown from "./UserBreakdown";
import Card from "../ui/Card";
import classes from "./UserInfo.module.css";
import Select from "../ui/Select";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { useState, useReducer } from "react";
import { cloneDeep } from "lodash";
import { userActions } from "../../store/userReducer";
import { expenseActions } from "../../store/expenseReducer";

enum FormActionType {
  SET_ENTERED_NAME,
  TOUCHED_NAME,
  SUBMIT_FORM,
  SET_ENTERED_PAYMENT_DETAILS,
  CANCEL_FORM,
  SHOW_FORM,
  HIDE_FORM,
  RENDER_FORM,
  SHOW_DELETE_ERROR,
  HIDE_DELETE_ERROR,
}

export type FormState = {
  name: {
    enteredName: string;
    nameValid: boolean;
    nameTouched: boolean;
    errorMessage: string;
  };
  paymentDetails: {
    enteredPaymentDetails: string;
  };
  isEditing: boolean;
  deleteError: boolean;
};

const validateName = (
  name: string,
  self: string,
  existingNames: string[]
): number => {
  if (name.trim().length === 0) {
    return -1;
  }
  if (existingNames.includes(name) && name !== self) {
    return -2;
  }
  return 0;
};

const formReducer = (state: FormState, action: any) => {
  const newState = cloneDeep(state);
  let validateRes: number;

  switch (action.type) {
    case FormActionType.SET_ENTERED_NAME:
      newState.name.enteredName = action.payload.value;
      newState.name.nameTouched = true;
      validateRes = validateName(
        newState.name.enteredName,
        action.payload.current,
        action.payload.existingNames
      );
      if (validateRes === 0) {
        newState.name.nameValid = true;
      } else {
        newState.name.nameValid = false;
        if (validateRes === -1) {
          newState.name.errorMessage = "Name cannot be empty";
        }
        if (validateRes === -2) {
          newState.name.errorMessage = "Name already exists";
        }
      }
      break;

    case FormActionType.TOUCHED_NAME:
      newState.name.nameTouched = true;
      validateRes = validateName(
        newState.name.enteredName,
        action.payload.current,
        action.payload.existingNames
      );

      if (validateRes === 0) {
        newState.name.nameValid = true;
      } else {
        newState.name.nameValid = false;
        if (validateRes === -1) {
          newState.name.errorMessage = "Name cannot be empty";
        }
        if (validateRes === -2) {
          newState.name.errorMessage = "Name already exists";
        }
      }
      break;

    case FormActionType.SET_ENTERED_PAYMENT_DETAILS:
      newState.paymentDetails.enteredPaymentDetails = action.payload.value;
      break;

    case FormActionType.CANCEL_FORM:
      newState.name.nameTouched = false;
      newState.name.nameValid = true;
      newState.name.errorMessage = "";
      newState.name.enteredName = action.payload.default.name;
      newState.paymentDetails.enteredPaymentDetails =
        action.payload.default.paymentDetails;

      break;

    case FormActionType.SUBMIT_FORM:
      if (newState.name.nameValid) {
        newState.name.nameTouched = false;
        newState.name.nameValid = true;
        newState.name.errorMessage = "";
        newState.name.enteredName = action.payload.default.name;
        newState.paymentDetails.enteredPaymentDetails =
          action.payload.default.paymentDetails;
      } else {
        newState.name.nameTouched = true;
      }
      break;

    case FormActionType.SHOW_FORM:
      newState.isEditing = true;
      break;

    case FormActionType.HIDE_FORM:
      newState.isEditing = false;
      break;

    case FormActionType.RENDER_FORM:
      newState.isEditing = false;
      newState.name.enteredName = action.payload.user.name;
      newState.name.nameTouched = false;
      newState.name.nameValid = true;
      newState.name.errorMessage = "";
      newState.paymentDetails.enteredPaymentDetails =
        action.payload.user.paymentDetails;
      break;

    case FormActionType.SHOW_DELETE_ERROR:
      newState.deleteError = true;
      break;

    case FormActionType.HIDE_DELETE_ERROR:
      newState.deleteError = false;
      break;

    default:
      console.error("Invalid action type");
      break;
  }
  return newState;
};

const initialFormState: FormState = {
  name: {
    enteredName: "",
    nameValid: false,
    nameTouched: false,
    errorMessage: "Name cannot be empty",
  },
  paymentDetails: {
    enteredPaymentDetails: "",
  },
  isEditing: false,
  deleteError: false,
};

const UserInfo: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null | undefined>(
    null
  );

  const users: User[] = useSelector((state: RootState) => state.users.users);

  const existingNames = useSelector((state: RootState) => {
    return state.users.users.map((user: User) => user.name);
  });

  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  const editButtonClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    dispatchFormState({ type: FormActionType.SHOW_FORM });
    dispatchFormState({ type: FormActionType.HIDE_DELETE_ERROR });
  };

  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );

  const dispatch = useDispatch();

  const cancelClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatchFormState({
      type: FormActionType.SUBMIT_FORM,
      payload: {
        default: {
          name: selectedUser?.name,
          paymentDetails: selectedUser?.paymentDetails,
        },
      },
    });
    dispatchFormState({
      type: FormActionType.RENDER_FORM,
      payload: { user: selectedUser },
    });
  };

  const saveClickHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    //Revalidate Name
    const validateRes = validateName(
      formState.name.enteredName,
      selectedUser!.name,
      existingNames
    );
    if (validateRes !== 0) {
      dispatchFormState({
        type: FormActionType.SET_ENTERED_NAME,
        payload: {
          value: formState.name.enteredName,
          current: selectedUser?.name,
          existingNames,
        },
      });
      return;
    }

    dispatchFormState({
      type: FormActionType.SUBMIT_FORM,
      payload: {
        default: {
          name: selectedUser?.name,
          paymentDetails: selectedUser?.paymentDetails,
        },
      },
    });

    if (formState.name.nameValid) {
      //Dispatch redux action to update user details
      dispatch(
        userActions.editUser({
          name: formState.name.enteredName,
          paymentDetails: formState.paymentDetails.enteredPaymentDetails,
          currentName: selectedUser?.name,
        })
      );

      //Dispatch redux action to update expense list
      dispatch(
        expenseActions.changeUserExpenseReducer({
          oldName: selectedUser?.name,
          newName: formState.name.enteredName,
        })
      );

      const newUser: User = {
        name: formState.name.enteredName,
        paymentDetails: formState.paymentDetails.enteredPaymentDetails,
      };
      //Change the selected user to the new user
      setSelectedUser(newUser);

      //Rerender the form
      dispatchFormState({
        type: FormActionType.RENDER_FORM,
        payload: { user: newUser },
      });
    }
  };

  const nameInputChangedHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: FormActionType.SET_ENTERED_NAME,
      payload: {
        value: event.target.value,
        current: selectedUser?.name,
        existingNames,
      },
    });
  };

  const nameInputBlurHandler: React.FocusEventHandler<
    HTMLInputElement
  > = () => {
    dispatchFormState({
      type: FormActionType.TOUCHED_NAME,
      payload: { existingNames, current: selectedUser?.name },
    });
  };

  const paymentDetailsInputChangedHandler: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    dispatchFormState({
      type: FormActionType.SET_ENTERED_PAYMENT_DETAILS,
      payload: { value: event.target.value },
    });
  };

  const selectChangeHandler = (option: { label: string; value: string }) => {
    //Lookup user by name
    const selectedUser = users.find((user: User) => user.name === option.value);
    setSelectedUser(selectedUser);
    dispatchFormState({
      type: FormActionType.RENDER_FORM,
      payload: { user: selectedUser },
    });
    dispatchFormState({ type: FormActionType.HIDE_DELETE_ERROR });
  };

  const deleteButtonClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    if (!deleteValid) {
      dispatchFormState({ type: FormActionType.SHOW_DELETE_ERROR });
      return;
    }
    //If the user is not involved in any expense, delete the user
    setSelectedUser(null);
    dispatch(userActions.removeUser({ name: selectedUser?.name }));
  };

  const hideDeleteButtonClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    dispatchFormState({ type: FormActionType.HIDE_DELETE_ERROR });
  };

  //Validity checks
  const nameInputValid =
    formState.name.nameValid || !formState.name.nameTouched;

  let deleteValid = true;

  //Check if the selected user is involved in any expense
  for (let expense of expenses) {
    if (expense.paidBy === selectedUser?.name) {
      deleteValid = false;
    }
    for (let split of expense.splitBetween) {
      if (split[0] === selectedUser?.name && split[1] > 0) {
        deleteValid = false;
      }
    }
  }

  return (
    <div className={classes["user-info"]}>
      <Card>
        <div className={classes["user-info__inner"]}>
          {users.length > 0 ? (
            <>
              <div className={classes["user-info__select-container"]}>
                <Select
                  userList={users}
                  id="user-select"
                  label="Select user:"
                  valid
                  onChange={(option: any) => {
                    selectChangeHandler(option);
                  }}
                  value={
                    selectedUser
                      ? {
                          label: selectedUser?.name,
                          value: selectedUser?.name,
                        }
                      : null
                  }
                ></Select>
              </div>
              {selectedUser ? (
                <>
                  <UserProfile
                    formState={formState}
                    handlers={{
                      nameInputChangedHandler,
                      nameInputBlurHandler,
                      paymentDetailsInputChangedHandler,
                      cancelClickHandler,
                      saveClickHandler,
                      editButtonClickHandler,
                      deleteButtonClickHandler,
                      hideDeleteButtonClickHandler,
                    }}
                    nameInputValid={nameInputValid}
                    deleteValid={deleteValid}
                    user={selectedUser}
                  ></UserProfile>
                  <UserSummary currentUser={selectedUser}></UserSummary>
                  <UserBreakdown selectedUser={selectedUser}></UserBreakdown>
                </>
              ) : (
                <p>Select a user to see user info</p>
              )}
            </>
          ) : (
            <p className={classes["no-users"]}>Add a user to get started</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserInfo;
