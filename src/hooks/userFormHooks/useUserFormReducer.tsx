import { useReducer } from "react";
import { cloneDeep } from "lodash";
import { UserFormActionType } from "../../enums/UserFormActionType";

export type UserFormState = {
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
    deleteError: boolean;
  };
};

const initialFormState: UserFormState = {
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
    deleteError: false,
  },
};

const validateName = (
  name: string,
  existingNames: string[],
  self?: string
): number => {
  if (name.trim().length === 0) {
    return -1;
  }
  if (existingNames.includes(name)) {
    if (self && name === self) {
      return 0;
    }
    return -2;
  }
  return 0;
};

const formReducer = (state: UserFormState, action: any) => {
  const newState = cloneDeep(state);
  let validateRes: number;

  switch (action.type) {
    case UserFormActionType.SHOW_FORM:
      newState.formState.formShowing = true;
      break;

    case UserFormActionType.HIDE_FORM:
      newState.formState.formShowing = false;
      break;

    case UserFormActionType.SET_ENTERED_NAME:
      newState.name.enteredName = action.payload.value;
      newState.name.nameTouched = true;
      validateRes = validateName(
        newState.name.enteredName,
        action.payload.existingNames,
        action.payload.currentName
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

    case UserFormActionType.TOUCHED_NAME:
      newState.name.nameTouched = true;
      validateRes = validateName(
        newState.name.enteredName,
        action.payload.existingNames,
        action.payload.currentName
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

    case UserFormActionType.SET_ENTERED_PAYMENT_DETAILS:
      newState.paymentDetails.enteredPaymentDetails = action.payload.value;
      break;

    case UserFormActionType.SUBMIT_FORM:
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

    //Edit specific form actions
    case UserFormActionType.RENDER_FORM:
      newState.name.enteredName = action.payload.user.name;
      newState.name.nameTouched = false;
      newState.name.nameValid = true;
      newState.name.errorMessage = "";
      newState.paymentDetails.enteredPaymentDetails =
        action.payload.user.paymentDetails;
      break;

    case UserFormActionType.CANCEL_EDIT_FORM:
      newState.name.nameTouched = false;
      newState.name.nameValid = true;
      newState.name.errorMessage = "";
      newState.name.enteredName = action.payload.default.name;
      newState.paymentDetails.enteredPaymentDetails =
        action.payload.default.paymentDetails;
      break;

    case UserFormActionType.SHOW_DELETE_ERROR:
      newState.formState.deleteError = true;
      break;

    case UserFormActionType.HIDE_DELETE_ERROR:
      newState.formState.deleteError = false;
      break;

    default:
      console.error("Invalid action type");
      break;
  }
  return newState;
};

const useUserFormReducer = () => {
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState
  );

  return { formState, dispatchFormState, validateName };
};

export default useUserFormReducer;
