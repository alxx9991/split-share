import UserForm from "./UserForm";
import UserInfo from "./UserInfo";
import classes from "./index.module.css";
import { useEffect } from "react";
import useFetchData from "../../hooks/useFetchData";
import Card from "../ui/Card";

const Users = () => {
  const { syncData, fetchIsLoading, fetchError } = useFetchData();
  useEffect(() => {
    syncData();
  }, []);

  return (
    <div className={classes.users}>
      {fetchIsLoading ? (
        <Card>Loading users...</Card>
      ) : fetchError ? (
        <Card>{fetchError}</Card>
      ) : (
        <>
          <UserForm></UserForm>
          <UserInfo></UserInfo>
        </>
      )}
    </div>
  );
};

export default Users;
