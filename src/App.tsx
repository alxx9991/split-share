import "./App.css";
import Header from "./components/header/Header";
import Expenses from "./components/expenses";
import Users from "./components/users/Users";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header></Header>
        <Routes>
          <Route path="/" element={<Expenses />}></Route>
          <Route path="users" element={<Users></Users>}></Route>
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
