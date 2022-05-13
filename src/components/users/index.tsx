import UserForm from "./UserForm";
import UserInfo from "./UserInfo";
import classes from "./styles/Users.module.css";

const Users: React.FC = () => {
  return (
    <div className={classes.users}>
      <UserForm></UserForm>
      <UserInfo></UserInfo>
    </div>
  );
};

export default Users;
