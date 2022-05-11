import useUserFormReducer from "./useUserFormReducer";
import useUpdateData from "../useUpdateData";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { UserFormActionType } from "../../enums/UserFormActionType";
import { UpdateType } from "../../enums/updateType";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/userReducer";

const useUserForm = () => {
  const { formState, dispatchFormState, validateName } = useUserFormReducer();

  const dispatch = useDispatch();

  const { updateDataReducer } = useUpdateData();

  //User selectors
  const users = useSelector((state: RootState) =>
    Object.values(state.users.users)
  );
  const selectedUser = useSelector(
    (state: RootState) => state.users.selectedUser
  );
  const existingNames = useSelector((state: RootState) => {
    return Object.values(state.users.users).map((user) => user.name);
  });

  //Expense selectors
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const expenseList = Object.values(expenses);

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
        paymentDetails: formState.paymentDetails.enteredPaymentDetails,
      };

      const addUserSuccess = await updateDataReducer(UpdateType.ADD_USER, {
        user: newUser,
      });

      //If added user successfully, dispatch form state
      if (addUserSuccess) {
        dispatchFormState({ type: UserFormActionType.SUBMIT_FORM });
      }
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
    dispatchFormState({ type: UserFormActionType.SHOW_FORM });
    dispatchFormState({ type: UserFormActionType.HIDE_DELETE_ERROR });
  };

  const cancelEditClickHandler: React.MouseEventHandler<
    HTMLButtonElement
  > = () => {
    dispatchFormState({
      type: UserFormActionType.SUBMIT_FORM,
      payload: {
        default: {
          name: selectedUser?.name,
          paymentDetails: selectedUser?.paymentDetails,
        },
      },
    });
    dispatchFormState({
      type: UserFormActionType.RENDER_FORM,
      payload: { user: selectedUser },
    });
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

    dispatchFormState({
      type: UserFormActionType.SUBMIT_FORM,
      payload: {
        default: {
          name: selectedUser?.name,
          paymentDetails: selectedUser?.paymentDetails,
        },
      },
    });

    if (formState.name.nameValid) {
      const newUser: User = {
        name: formState.name.enteredName,
        paymentDetails: formState.paymentDetails.enteredPaymentDetails,
      };

      await updateDataReducer(UpdateType.EDIT_USER, {
        newUser,
        oldUser: selectedUser,
      });

      //Rerender the form
      dispatchFormState({
        type: UserFormActionType.RENDER_FORM,
        payload: { user: newUser },
      });
    }
  };

  const selectChangeHandler = (option: { label: string; value: string }) => {
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
  };
};

export default useUserForm;
