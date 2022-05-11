import classes from "./styles/ExpensesListSplit.module.css";

const ExpensesListSplit: React.FC<{ splitBetween: UserSplit[] }> = (props) => {
  return (
    <table className={classes["user-split"]}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {props.splitBetween.map((usersplit: UserSplit) => {
          return (
            <tr key={usersplit[0]}>
              <td>{usersplit[0]}</td>
              <td>${usersplit[1]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ExpensesListSplit;
