type Expense = {
  id: string;
  name: string;
  date: string;
  paidBy: string;
  splitBetween: UserSplit[];
  amount: number;
};

type User = {
  name: string;
  paymentDetails: string;
};

type UserSplit = [string, number | string];

type Reducer<State, Action> = (state: State, action: Action) => State;
