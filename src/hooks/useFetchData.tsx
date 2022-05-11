import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { userActions } from "../store/userReducer";
import { expenseActions } from "../store/expenseReducer";
import { globalActions } from "../store/globalReducer";

import axios from "axios";
const BASE_URL =
  "https://split-share-89844-default-rtdb.asia-southeast1.firebasedatabase.app/";

const useFetchData = () => {
  const [fetchIsLoading, setFetchIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<any>(null);
  const dispatch = useDispatch();
  const params = useParams();
  const docID = params.docID;

  const getData = useCallback(async () => {
    setFetchIsLoading(true);
    setFetchError(null);
    const res: any = await axios
      .get(`${BASE_URL}/documents/${docID}.json`)
      .then((res) => {
        if (res === null) {
          setFetchError("Document does not exist");
          console.error("Document does not exist");
          setFetchIsLoading(false);
          return null;
        }
        return res.data;
      })
      .catch((err) => {
        console.error(fetchError);
        setFetchError(err.message);
      });
    setFetchIsLoading(false);

    return res;
  }, []);

  //Pulls data off the cloud and updates the local store, and optionall you can change the selected user
  const syncData = useCallback(async (selectedUser?: User | null) => {
    const res = await getData();
    setFetchError(null);
    if (res === null) {
      setFetchError("Document does not exist");
      console.error("Document does not exist");
      return null;
    }

    if (res === undefined) {
      setFetchError("Failed to fetch data");
      console.error("Failed to fetch data");
      return null;
    }

    dispatch(userActions.setUsersReducer({ users: res.users, selectedUser }));
    dispatch(expenseActions.setExpensesReducer({ expenses: res.expenses }));
    dispatch(globalActions.setDocIDReducer({ docID }));

    return res;
  }, []);
  return { fetchIsLoading, fetchError, getData, syncData };
};

export default useFetchData;
