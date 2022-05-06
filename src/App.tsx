import "./App.css";
import Header from "./components/header/Header";
import Expenses from "./components/expenses";
import Users from "./components/users";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import CreateExpenses from "./components/create";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header></Header>
        <Routes>
          <Route path="/" element={<CreateExpenses></CreateExpenses>}></Route>
          <Route
            path="/expenses"
            element={<CreateExpenses></CreateExpenses>}
          ></Route>
          <Route path="/expenses/:docID" element={<Expenses />}></Route>
          <Route
            path="users"
            element={<CreateExpenses></CreateExpenses>}
          ></Route>
          <Route path="/users/:docID" element={<Users />}></Route>
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
