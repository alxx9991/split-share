import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import useFetchData from "./useFetchData";
import { RootState } from "../store";
import { UpdateType } from "../enums/updateType";

const BASE_URL =
  "https://split-share-89844-default-rtdb.asia-southeast1.firebasedatabase.app";

const useUpdateData = () => {
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState<any>(null);
  const { fetchIsLoading, getData, syncData, fetchError } = useFetchData();
  const users = useSelector((state: RootState) => state.users.users);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  //Retrieves data from database and checks if the data is unchanged. Throws an error if the data is not received, or if the data is changed. Returns cloned version of data
  const verifyData = async () => {
    setUpdateIsLoading(true);
    setUpdateError(null);

    //Check document exists
    const data = await getData();

    //If document does not exist, return false
    if (!data) {
      setUpdateError("Failed to fetch data.");
      return null;
    }

    //Verify that the data on the database is the same as the data in the store
    if (
      JSON.stringify(data.users) !== JSON.stringify(users) ||
      JSON.stringify(data.expenses) !== JSON.stringify(expenses)
    ) {
      setUpdateError("Local data out of sync. Please refresh the page.");
      console.error("Local data out of sync. Please refresh the page.");
      return null;
    }

    return cloneDeep(data);
  };

  //Pushes data to database. Returns the response if worked, otherwise returns null
  const pushChanges = async (newData: any) => {
    const res = await axios
      .put(`${BASE_URL}/documents/${newData.docID}.json`, newData)
      .catch((err) => {
        setUpdateError(err.message);
        return null;
      });

    return res;
  };

  const updateDataReducer = async (type: UpdateType, payload: any) => {
    //Verify data is up to date
    const data = await verifyData();
    if (data === null) {
      return null;
    }

    //If new selected user is -1, do not change the selected user.
    let newSelectedUser: User | number | null | undefined = -1;

    const expenses: { [key: string]: Expense } = data.expenses;
    const users: { [key: string]: User } = data.users;

    //Modify data based on the type
    switch (type) {
      case UpdateType.ADD_EXPENSE:
        expenses[payload.expense.id] = payload.expense;
        break;

      case UpdateType.DELETE_EXPENSE:
        delete expenses[payload.expenseID];
        break;

      //payload: {
      //user: User,
      //}
      case UpdateType.ADD_USER:
        users[payload.user.name] = payload.user;
        for (let expense of Object.values(expenses)) {
          expense.splitBetween.push([payload.user.name, 0]);
        }
        break;

      //payload: {
      //oldUser: User,
      //newUser: User,
      //}
      case UpdateType.EDIT_USER:
        //Replace user in users object
        delete users[payload.oldUser.name];
        users[payload.newUser.name] = payload.newUser;

        //Replace user in expenses object
        for (let expense of Object.values(expenses)) {
          if (expense.paidBy === payload.oldUser.name) {
            expense.paidBy = payload.newUser.name;
          }
          //Replace user in splitBetween
          for (let userSplit of expense.splitBetween) {
            if (userSplit[0] === payload.oldUser.name) {
              userSplit[0] = payload.newUser.name;
            }
          }
        }

        //Set selected user
        newSelectedUser = payload.newUser;
        break;

      //payload: {
      //user: User,
      //}
      case UpdateType.DELETE_USER:
        //Delete user from users object
        delete users[payload.user.name];

        //Delete user from expenses object
        for (let expense of Object.values(expenses)) {
          if (expense.paidBy === payload.user.name) {
            console.error(
              "Error detected deleting user, user is still involved in expenses."
            );
          }
          //Delete user from splitBetween
          const index = expense.splitBetween.findIndex(
            (userSplit) => userSplit[0] === payload.user.name
          );

          if (index !== -1) {
            if (expense.splitBetween[index][1] !== 0) {
              console.error(
                "Error detected deleting user, user is still involved in expenses."
              );
            }
            expense.splitBetween.splice(index, 1);
          }
        }

        //Set selected user to null
        newSelectedUser = null;
        break;

      default:
        console.error("Unknown update type.");
        return null;
    }

    //Push changes to the data
    const res = await pushChanges(data);
    if (!res) {
      return null;
    }

    const sync =
      newSelectedUser === -1
        ? syncData()
        : syncData(newSelectedUser as User | null | undefined);
    if (!sync) {
      return null;
    }
    return sync;
  };

  const addDocument = async (docID: string) => {
    return axios.put(`${BASE_URL}/documents/${docID}.json`, {
      key: uuidv4(),
      expenses: [],
      users: [],
    });
  };

  return {
    setIsLoading: setUpdateIsLoading,
    isLoading: updateIsLoading,
    setError: setUpdateError,
    error: updateError,
    fetchIsLoading,
    fetchError,
    addDocument,
    updateDataReducer,
  };
};

export default useUpdateData;
