import useUserFormReducer from "./useUserFormReducer";
import useUpdateData from "../useUpdateData";
import { UserFormActionType } from "../../enums/UserFormActionType";
import { UpdateType } from "../../enums/updateType";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/userReducer";
import useData from "../useData";

const useUserForm = () => {
  //Hooks
  const { formState, dispatchFormState, validateName } = useUserFormReducer();

  const dispatch = useDispatch();

  const {
    updateDataReducer,
    isLoading: updateLoading,
    setIsLoading: setUpdateIsLoading,
    error: updateError,
    setError: setUpdateError,
  } = useUpdateData();

  const {
    usersList: users,
    expensesList: expenseList,
    selectedUser,
  } = useData();

  const existingNames = users.map((user) => user.name);

  const setSelectedUser = (user: User | null) => {
    dispatch(userActions.setSelectedUserReducer({ selectedUser: user }));
  };

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
          type: UserFormActionType.SET_ENTERED_NAME,
          payload: { value: formState.name.enteredName, existingNames },
        });
        return;
      }
      const newUser: User = {
        name: formState.name.enteredName,
        paymentDetails: formState.paymentDetails.enteredPaymentDetails
          ? formState.paymentDetails.enteredPaymentDetails
          : "No payment details provided",
      };

      const addUserSuccess = await updateDataReducer(UpdateType.ADD_USER, {
        user: newUser,
      });

      //If added user successfully, dispatch form state
      if (addUserSuccess) {
        dispatchFormState({ type: UserFormActionType.SUBMIT_FORM });
      }
      setUpdateIsLoading(false);
    } else {
      dispatchFormState({ type: UserFormActionType.SHOW_FORM });
    }
  };

  const cancelClickHandler: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    dispatchFormState({ type: UserFormActionType.HIDE_FORM });
  };

  const nameInputChangedHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    dispatchFormState({
      type: UserFormActionType.SET_ENTERED_NAME,
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
      type: UserFormActionType.TOUCHED_NAME,
      payload: { existingNames },
    });
  };

  const paymentDetailsInputChangedHandler: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    dispatchFormState({
      type: UserFormActionType.SET_ENTERED_PAYMENT_DETAILS,
      payload: { value: event.target.value },
    });
  };

  //Edit specific handlers
  const editNameInputChangedHandler: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    dispatchFormState({
      type: UserFormActionType.SET_ENTERED_NAME,
      payload: {
        value: event.target.value,
        existingNames,
        currentName: selectedUser?.name,
      },
    });
  };

  const editNameInputBlurHandler: React.FocusEventHandler<
    HTMLInputElement
  > = () => {
    dispatchFormState({
      type: UserFormActionType.TOUCHED_NAME,
      payload: { existingNames, currentName: selectedUser?.name },
    });
  };

  const editButtonClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setUpdateError(null);
    dispatchFormState({ type: UserFormActionType.SHOW_FORM });
    dispatchFormState({
      type: UserFormActionType.RENDER_FORM,
      payload: { user: selectedUser },
    });
    dispatchFormState({ type: UserFormActionType.HIDE_DELETE_ERROR });
  };

  const cancelEditClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    setUpdateError(null);
    dispatchFormState({
      type: UserFormActionType.RENDER_FORM,
      payload: { user: selectedUser },
    });
    dispatchFormState({ type: UserFormActionType.HIDE_FORM });
  };

  const saveClickHandler: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();

    //Revalidate Name
    const validateRes = validateName(
      formState.name.enteredName,
      existingNames,
      selectedUser!.name
    );

    //If name is invalid, then set the entered name and return to revalidate
    if (validateRes !== 0) {
      dispatchFormState({
        type: UserFormActionType.SET_ENTERED_NAME,
        payload: {
          value: formState.name.enteredName,
          currentName: selectedUser?.name,
          existingNames,
        },
      });
      return;
    }

    if (formState.name.nameValid) {
      const newUser: User = {
        name: formState.name.enteredName,
        paymentDetails: formState.paymentDetails.enteredPaymentDetails
          ? formState.paymentDetails.enteredPaymentDetails
          : "No payment details provided",
      };

      const res = await updateDataReducer(UpdateType.EDIT_USER, {
        newUser,
        oldUser: selectedUser,
      });

      if (!res) {
        setUpdateIsLoading(false);
        return;
      }

      dispatchFormState({
        type: UserFormActionType.SUBMIT_FORM,
        payload: {
          default: {
            name: selectedUser?.name,
            paymentDetails: selectedUser?.paymentDetails,
          },
        },
      });

      //Rerender the form
      dispatchFormState({
        type: UserFormActionType.RENDER_FORM,
        payload: { user: newUser },
      });

      setUpdateIsLoading(false);
    }
  };

  const selectChangeHandler = (option: { label: string; value: string }) => {
    setUpdateError(null);
    //Lookup user by name
    const selectedUser = users.find((user: User) => user.name === option.value);
    if (selectedUser) {
      setSelectedUser(selectedUser);
    } else {
      setSelectedUser(null);
    }

    dispatchFormState({
      type: UserFormActionType.RENDER_FORM,
      payload: { user: selectedUser },
    });
    dispatchFormState({ type: UserFormActionType.HIDE_FORM });
    dispatchFormState({ type: UserFormActionType.HIDE_DELETE_ERROR });
  };

  const deleteButtonClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (!deleteValid) {
      dispatchFormState({ type: UserFormActionType.SHOW_DELETE_ERROR });
      return;
    }
    //If the user is not involved in any expense, delete the user
    await updateDataReducer(UpdateType.DELETE_USER, { user: selectedUser });

    setUpdateIsLoading(false);
  };

  const hideDeleteButtonClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    dispatchFormState({ type: UserFormActionType.HIDE_DELETE_ERROR });
  };

  const nameInputValid =
    formState.name.nameValid || !formState.name.nameTouched;

  //To make sure deleting is valid, check if the selected user is involved in any expense
  let deleteValid = true;
  for (let expense of expenseList) {
    if (expense.paidBy === selectedUser?.name) {
      deleteValid = false;
    }
    for (let split of expense.splitBetween) {
      if (split[0] === selectedUser?.name && split[1] > 0) {
        deleteValid = false;
      }
    }
  }

  return {
    handlers: {
      nameInputChangedHandler,
      nameInputBlurHandler,
      paymentDetailsInputChangedHandler,
      addUserClickHandler,
      cancelClickHandler,
    },
    editHandlers: {
      editNameInputChangedHandler,
      editNameInputBlurHandler,
      editButtonClickHandler,
      cancelEditClickHandler,
      saveClickHandler,
      deleteButtonClickHandler,
      hideDeleteButtonClickHandler,
      selectChangeHandler,
    },
    formState,
    nameInputValid,
    deleteValid,
    updateLoading,
    updateError,
  };
};

export default useUserForm;
