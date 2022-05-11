import classes from "./styles/UserProfile.module.css";
import Input from "../ui/Input";
import { UserFormState } from "../../hooks/userFormHooks/useUserFormReducer";
import React from "react";

const UserProfile: React.FC<{
  formState: UserFormState;
  handlers: {
    editNameInputChangedHandler: (
      e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    editNameInputBlurHandler: (e: React.FocusEvent<HTMLInputElement>) => void;
    paymentDetailsInputChangedHandler: (
      e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    cancelEditClickHandler: React.MouseEventHandler<HTMLButtonElement>;
    saveClickHandler: React.MouseEventHandler<HTMLButtonElement>;
    editButtonClickHandler: React.MouseEventHandler<HTMLButtonElement>;
    deleteButtonClickHandler: React.MouseEventHandler<HTMLButtonElement>;
    hideDeleteButtonClickHandler: React.MouseEventHandler<HTMLButtonElement>;
  };
  user: User | null | undefined;
  nameInputValid: boolean;
  deleteValid: boolean;
}> = (props) => {
  return (
    <div className={classes["user-profile"]}>
      <h2>Profile</h2>
      <div className={classes["user-profile__contents"]}>
        {props.formState.formState.formShowing ? (
          <form>
            <Input
              label={"Edit Name"}
              attributes={{
                type: "text",
                value: props.formState.name.enteredName,
                onChange: props.handlers.editNameInputChangedHandler,
                onBlur: props.handlers.editNameInputBlurHandler,
              }}
              valid={props.nameInputValid}
              errorMessage={props.formState.name.errorMessage}
            ></Input>
            <Input
              attributes={{
                type: "text",
                id: "name",
                onChange: props.handlers.paymentDetailsInputChangedHandler,
                value: props.formState.paymentDetails.enteredPaymentDetails,
              }}
              label="Payment Details"
              valid={true}
            ></Input>
            <div className={classes["user-profile__buttons"]}>
              <button
                onClick={props.handlers.cancelEditClickHandler}
                type="button"
              >
                Cancel
              </button>
              <button onClick={props.handlers.saveClickHandler}>Save</button>
            </div>
          </form>
        ) : (
          <>
            <div>
              <h5>Name</h5>
              <p>{props.user?.name}</p>
            </div>
            <div>
              <h5>Payment Details</h5>
              <div>
                <p>{props.user?.paymentDetails}</p>
              </div>
            </div>
            <div className={classes["user-profile__buttons"]}>
              <button onClick={props.handlers.editButtonClickHandler}>
                Edit
              </button>
              <button
                onClick={props.handlers.deleteButtonClickHandler}
                className={props.deleteValid ? "" : classes["inactive-button"]}
              >
                Delete
              </button>
            </div>
            {props.formState.formState.deleteError && (
              <div className={classes["error-container"]}>
                <p>
                  Error: The current user is involved in existing expenses and
                  cannot be deleted.
                </p>
                <button
                  className={classes["error-button"]}
                  onClick={props.handlers.hideDeleteButtonClickHandler}
                >
                  Ok
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
