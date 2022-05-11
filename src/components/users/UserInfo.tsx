import UserProfile from "./UserProfile";
import UserSummary from "./UserSummary";
import UserBreakdown from "./UserBreakdown";
import Card from "../ui/Card";
import classes from "./styles/UserInfo.module.css";
import Select from "../ui/Select";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useUserForm from "../../hooks/userFormHooks/useUserForm";

const UserInfo: React.FC = () => {
  const { handlers, editHandlers, formState, nameInputValid, deleteValid } =
    useUserForm();

  const { paymentDetailsInputChangedHandler } = handlers;

  const {
    editNameInputBlurHandler,
    editNameInputChangedHandler,
    editButtonClickHandler,
    cancelEditClickHandler,
    saveClickHandler,
    deleteButtonClickHandler,
    hideDeleteButtonClickHandler,
    selectChangeHandler,
  } = editHandlers;

  //User selectors
  const users = useSelector((state: RootState) =>
    Object.values(state.users.users)
  );
  const selectedUser = useSelector(
    (state: RootState) => state.users.selectedUser
  );

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
                      editNameInputChangedHandler,
                      editNameInputBlurHandler,
                      paymentDetailsInputChangedHandler,
                      cancelEditClickHandler,
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
