import Card from "../ui/Card";
import Button from "../ui/Button";
import classes from "./UserForm.module.css";
import React, { useReducer } from "react";
import { cloneDeep } from "lodash";
import Input from "../ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import useUpdateData from "../../hooks/useUpdateData";
import { useParams } from "react-router-dom";
import { UpdateType } from "../../enums/updateType";

enum FormActionType {
  SHOW_FORM,
  HIDE_FORM,
  SET_ENTERED_NAME,
  TOUCHED_NAME,
  SUBMIT_FORM,
  SET_ENTERED_PAYMENT_DETAILS,
}

type FormState = {
  name: {
    enteredName: string;
    nameValid: boolean;
    nameTouched: boolean;
    errorMessage: string;
  };
  paymentDetails: {
    enteredPaymentDetails: string;
  };
  formState: {
    formShowing: boolean;
  };
};

const validateName = (name: string, existingNames: string[]): number => {
  if (name.trim().length === 0) {
    return -1;
  }
  if (existingNames.includes(name)) {
    return -2;
  }
  return 0;
};

const formReducer = (state: FormState, action: any) => {
  const newState = cloneDeep(state);
  let validateRes: number;

  switch (action.type) {
    case FormActionType.SHOW_FORM:
      newState.formState.formShowing = true;
      break;

    case FormActionType.HIDE_FORM:
      newState.formState.formShowing = false;
      break;

    case FormActionType.SET_ENTERED_NAME:
      newState.name.enteredName = action.payload.value;
      newState.name.nameTouched = true;
      validateRes = validateName(
        newState.name.enteredName,
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

    case FormActionType.SUBMIT_FORM:
      if (newState.name.nameValid) {
        newState.formState.formShowing = false;
        newState.name.enteredName = "";
        newState.name.nameTouched = false;
        newState.name.nameValid = false;
        newState.name.errorMessage = "";
        newState.paymentDetails.enteredPaymentDetails = "";
      } else {
        newState.name.nameTouched = true;
      }
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
  formState: {
    formShowing: false,
  },
};

const UserForm: React.FC = () => {
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );

  const { updateDataReducer } = useUpdateData();

  const params = useParams();

  const docID = params.docID;

  const dispatch = useDispatch();

  const existingNames = useSelector((state: RootState) => {
    return Object.values(state.users.users).map((user) => user.name);
  });

  const addUserClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = async (event) => {
    event.preventDefault();
    if (formState.formState.formShowing) {
      //Recheck form validity
      const validateRes = validateName(
        formState.name.enteredName,
        existingNames
      );
      if (validateRes !== 0) {
        dispatchFormState({
          type: FormActionType.SET_ENTERED_NAME,
          payload: { value: formState.name.enteredName, existingNames },
        });
        return;
      }
      const newUser: User = {
        name: formState.name.enteredName,
        paymentDetails: formState.paymentDetails.enteredPaymentDetails,
      };

      const addUserSuccess = await updateDataReducer(UpdateType.ADD_USER, {
        user: newUser,
      });

      //If added user successfully, dispatch form state
      if (addUserSuccess) {
        dispatchFormState({ type: FormActionType.SUBMIT_FORM });
      }
    } else {
      dispatchFormState({ type: FormActionType.SHOW_FORM });
    }

    //If form valid, dispatch the redux action to add the user
    if (formState.name.nameValid) {
      // dispatch(
      //   userActions.addUser({
      //     id: uuidv4(),
      //     name: formState.name.enteredName,
      //     paymentDetails: formState.paymentDetails.enteredPaymentDetails,
      //   })
      // );
      // dispatch(
      //   expenseActions.addUserExpenseReducer({
      //     name: formState.name.enteredName,
      //   })
      // );
    }
  };

  const cancelClickHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    dispatchFormState({ type: FormActionType.HIDE_FORM });
  };

  const nameInputChangedHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: FormActionType.SET_ENTERED_NAME,
      payload: {
        value: event.target.value,
        existingNames,
      },
    });
  };

  const nameInputBlurHandler: React.FocusEventHandler<
    HTMLInputElement
  > = () => {
    dispatchFormState({
      type: FormActionType.TOUCHED_NAME,
      payload: { existingNames },
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
  const nameInputValid =
    formState.name.nameValid || !formState.name.nameTouched;
  return (
    <div className={classes["user-form"]}>
      <Card>
        <form action="">
          {formState.formState.formShowing && (
            <>
              <Input
                attributes={{
                  type: "text",
                  id: "name",
                  onChange: nameInputChangedHandler,
                  onBlur: nameInputBlurHandler,
                  value: formState.name.enteredName,
                }}
                label="Name"
                valid={nameInputValid}
                errorMessage={formState.name.errorMessage}
              ></Input>
              <Input
                attributes={{
                  type: "text",
                  id: "name",
                  onChange: paymentDetailsInputChangedHandler,
                  value: formState.paymentDetails.enteredPaymentDetails,
                  placeholder:
                    "e.g. Beem: @beem_user_123, Acc No: 1234 5678, BSB: 100-102",
                }}
                label="Payment Details"
                valid={true}
              ></Input>
            </>
          )}
          <div className={classes["user-form__buttons"]}>
            {formState.formState.formShowing && (
              <Button onClick={cancelClickHandler}>Cancel</Button>
            )}
            <Button
              onClick={addUserClickHandler}
              inactive={
                formState.formState.formShowing
                  ? formState.name.nameValid
                    ? false
                    : true
                  : false
              }
            >
              Add User
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;
