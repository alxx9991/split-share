import Card from "../ui/Card";
import Button from "../ui/Button";
import classes from "./styles/UserForm.module.css";
import React from "react";
import Input from "../ui/Input";
import useUserForm from "../../hooks/userFormHooks/useUserForm";

const UserForm: React.FC = () => {
  const { handlers, formState, nameInputValid } = useUserForm();
  const {
    nameInputChangedHandler,
    nameInputBlurHandler,
    paymentDetailsInputChangedHandler,
    addUserClickHandler,
    cancelClickHandler,
  } = handlers;

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
