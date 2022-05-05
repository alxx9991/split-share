import UserForm from "./UserForm";
import UserInfo from "./UserInfo";
import classes from "./index.module.css";

const Users = () => {
  return (
    <div className={classes.users}>
      <UserForm></UserForm>
      <UserInfo></UserInfo>
    </div>
  );
};

export default Users;
