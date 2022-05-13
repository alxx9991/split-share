import "./App.css";
import Header from "./components/header/Header";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Home from "./components/home";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header></Header>
        <Routes>
          <Route path="/*" element={<Home></Home>}></Route>
          <Route path="/:docID/*" element={<Home></Home>}></Route>
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
