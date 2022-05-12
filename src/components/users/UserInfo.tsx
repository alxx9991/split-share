import UserProfile from "./UserProfile";
import UserSummary from "./UserSummary";
import UserBreakdown from "./UserBreakdown";
import Card from "../ui/Card";
import classes from "./styles/UserInfo.module.css";
import Select from "../ui/Select";
import useUserForm from "../../hooks/userFormHooks/useUserForm";
import useData from "../../hooks/useData";

const UserInfo: React.FC = () => {
  const {
    handlers,
    editHandlers,
    formState,
    nameInputValid,
    deleteValid,
    updateLoading,
    updateError,
  } = useUserForm();

  const { usersList: users, selectedUser } = useData();

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
                    updateError={updateError}
                    updateLoading={updateLoading}
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
