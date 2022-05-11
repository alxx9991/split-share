import { useSelector } from "react-redux";
import { RootState } from "../../store";
import classes from "./styles/UserSummary.module.css";

const UserSummary: React.FC<{ currentUser: User }> = (props) => {
  const users = useSelector((state: RootState) =>
    Object.values(state.users.users)
  );

  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  let expenseList: Expense[] = [];
  for (let expense of Object.values(expenses)) {
    expenseList.push(expense);
  }

  const balances = {} as { [key: string]: number };

  const paymentDetails = {} as { [key: string]: string };

  for (let user of users) {
    paymentDetails[user.name] = user.paymentDetails;
  }

  let selfBalance = 0;

  //Calculate who owes who what
  users.forEach((user) => {
    //Tally up the expenses
    balances[user.name] = 0;

    //Look at each expense and either add or subtract from the balance, depending on if the current user paid or not.
    expenseList.forEach((expense) => {
      //If the current user paid for the balance, add to the balance
      if (expense.paidBy === props.currentUser.name) {
        expense.splitBetween.forEach((split) => {
          if (split[0] === user.name) {
            balances[user.name] += split[1] as number;
          }
        });
      } else if (expense.paidBy === user.name) {
        //If the current user did not pay for the balance, subtract from the balance
        expense.splitBetween.forEach((split) => {
          if (split[0] === props.currentUser.name) {
            balances[user.name] -= split[1] as number;
          }
        });
      }
    });
  });

  //Calculate the self balance
  selfBalance = parseFloat(balances[props.currentUser.name].toFixed(2));

  //Delete the current user from the balances
  delete balances[props.currentUser.name];

  const positives: { [key: string]: number } = {};
  const negatives: { [key: string]: number } = {};

  //Sort the balances into positive and negative balances
  Object.keys(balances).forEach((key) => {
    if (balances[key] > 0) {
      positives[key] = balances[key];
    } else if (balances[key] < 0) {
      negatives[key] = -balances[key];
    }
  });

  const totalOwed = parseFloat(
    Object.keys(positives)
      .reduce((a, b) => a + positives[b], 0)
      .toFixed(2)
  );

  const totalOwing = parseFloat(
    Object.keys(negatives)
      .reduce((a, b) => a + negatives[b], 0)
      .toFixed(2)
  );

  const owing = Object.keys(negatives).map((negative) => {
    return (
      <li key={negative}>
        &#8226; You owe <span className={classes.username}>{negative}</span>{" "}
        <span className={classes.owing}>${negatives[negative].toFixed(2)}</span>{" "}
        | <span className={classes.bold}>Payment details: </span>
        {paymentDetails[negative]}
      </li>
    );
  });

  const owed = Object.keys(positives).map((positive) => {
    return (
      <li key={positive}>
        &#8226; <span className={classes.username}>{positive}</span> owes you{" "}
        <span className={classes.owed}>${positives[positive].toFixed(2)}</span>
      </li>
    );
  });

  return (
    <div className={classes["user-summary"]}>
      <h2>Summary</h2>
      <div className={classes["user-summary__content"]}>
        <div className={classes.entry}>
          <h5>
            To be paid:
            <span className={classes.owed}> ${totalOwed.toFixed(2)} </span>total
          </h5>
          <ul>{owed}</ul>
        </div>
        <div className={classes.entry}>
          <h5>
            To pay: <span className={classes.owing}>${totalOwing} </span>total
          </h5>
          <ul>{owing}</ul>
        </div>
        <div className={classes.entry}>
          <h5>
            Own spending:{" "}
            <span className={classes.own}>${selfBalance.toFixed(2)}</span> total{" "}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default UserSummary;
