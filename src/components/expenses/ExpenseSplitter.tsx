import classes from "./styles/ExpenseSplitter.module.css";

const ExpenseSplitter: React.FC<{
  splitBetween: UserSplit[];
  isSplitEvenly: boolean;
  amount: number | string;
  unallocated: number | string;
  expenseSplitterInputChangeHandler: (event: any, name: string) => void;
}> = (props) => {
  const inputs = props.splitBetween.map((userSplit: UserSplit) => {
    return (
      <div key={userSplit[0]} className={classes["expense-splitter__item"]}>
        <h5>How much does {userSplit[0]} owe?</h5>
        <input
          type="number"
          onChange={(event) => {
            props.expenseSplitterInputChangeHandler(event, userSplit[0]);
          }}
          value={userSplit[1]}
        />
      </div>
    );
  });
  const splitterClasses =
    props.isSplitEvenly ||
    !props.amount ||
    props.splitBetween.length === 0 ||
    props.amount <= 0
      ? `${classes["expense-splitter"]} ${classes["expense-splitter__unclickable"]}`
      : classes["expense-splitter"];

  let unallocated_message: string;
  if (props.unallocated > 0) {
    unallocated_message = `Unallocated: $${props.unallocated}`;
  } else {
    unallocated_message = `Total amount owing exceeds the expense amount by $${-props.unallocated}`;
  }
  return (
    <div className={splitterClasses}>
      <h5>Amounts Owing</h5>
      {inputs.length > 0 ? inputs : <p>No one to share between</p>}
      {props.amount === "" || props.amount <= 0 ? (
        <p>No amount entered</p>
      ) : null}
      {props.unallocated && props.amount && props.splitBetween.length > 0 ? (
        <h5 className={classes["expense-splitter__error-text"]}>
          {unallocated_message}
        </h5>
      ) : null}
    </div>
  );
};

export default ExpenseSplitter;
