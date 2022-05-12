import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { userActions } from "../store/userReducer";
import { expenseActions } from "../store/expenseReducer";
import { globalActions } from "../store/globalReducer";

import { cloneDeep } from "lodash";

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
    dispatch(globalActions.setDocIDReducer({ docID }));
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
        console.error(err.message);
        setFetchError(err.message);
      });
    setFetchIsLoading(false);

    //Clone the data and clean it up
    const data = cloneDeep(res);

    if (!data.expenses) {
      data.expenses = {} as { [key: string]: Expense };
    }
    if (!data.users) {
      data.users = {} as { [key: string]: User };
    }

    return data;
  }, [docID, dispatch]);

  //Pulls data off the cloud and updates the local store, and optionall you can change the selected user
  const syncData = useCallback(
    async (selectedUser?: User | null) => {
      const res = await getData();
      if (res === null) {
        setFetchError("Requested data does not exist");
        console.error("Requested data does not exist");
        return null;
      }

      if (res === undefined) {
        return null;
      }

      dispatch(userActions.setUsersReducer({ users: res.users, selectedUser }));
      dispatch(expenseActions.setExpensesReducer({ expenses: res.expenses }));

      return res;
    },
    [dispatch, getData]
  );
  return { fetchIsLoading, fetchError, getData, syncData };
};

export default useFetchData;
