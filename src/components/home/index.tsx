import CreateExpenses from "./CreateExpenses";
import HomePage from "./HomePage";
import useFetchData from "../../hooks/useFetchData";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Users from "../users";
import Expenses from "../expenses";
import { useParams } from "react-router-dom";
import Loading from "../ui/Loading";

const Home = () => {
  const docID = useParams().docID;

  const { syncData, fetchError, fetchIsLoading } = useFetchData();
  useEffect(() => {
    if (docID) {
      syncData();
    }
  }, [syncData, docID]);

  return (
    <>
      {fetchIsLoading || fetchError ? (
        <Loading
          loadingMessage={"Loading data..."}
          errorMessage={fetchError ? fetchError : ""}
          syncData={syncData}
          fetchIsLoading={fetchIsLoading}
        ></Loading>
      ) : (
        <>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {docID ? (
                    <HomePage></HomePage>
                  ) : (
                    <CreateExpenses></CreateExpenses>
                  )}
                </>
              }
            ></Route>
            <Route path="expenses" element={<Expenses />}></Route>
            <Route path="users" element={<Users />}></Route>
          </Routes>
        </>
      )}
    </>
  );
};

export default Home;
