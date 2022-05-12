import { useSelector } from "react-redux";
import { RootState } from "../store";

const useData = () => {
  const usersList = useSelector((state: RootState) => {
    if (state.users.users) {
      return Object.values(state.users.users);
    }
    return [];
  });

  const expensesList = useSelector((state: RootState) => {
    if (state.expenses.expenses) {
      return Object.values(state.expenses.expenses);
    }
    return [];
  });

  const selectedUser = useSelector(
    (state: RootState) => state.users.selectedUser
  );

  return { selectedUser, usersList, expensesList };
};

export default useData;
