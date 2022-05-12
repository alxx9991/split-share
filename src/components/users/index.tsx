import UserForm from "./UserForm";
import UserInfo from "./UserInfo";
import classes from "./styles/Users.module.css";
import { useEffect } from "react";
import useFetchData from "../../hooks/useFetchData";
import Loading from "../ui/Loading";

const Users = () => {
  const { syncData, fetchIsLoading, fetchError } = useFetchData();
  useEffect(() => {
    syncData();
  }, [syncData]);

  return (
    <div className={classes.users}>
      {fetchIsLoading || fetchError ? (
        <Loading
          loadingMessage={"Loading users..."}
          errorMessage={fetchError ? fetchError : ""}
          syncData={syncData}
          fetchIsLoading={fetchIsLoading}
        ></Loading>
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
