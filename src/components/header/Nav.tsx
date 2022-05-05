import { Link } from "react-router-dom";
import Button from "../ui/Button";
import classes from "./Nav.module.css";
import { useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation();

  return (
    <div className={classes.nav}>
      <nav>
        <Link to="/">
          {" "}
          <Button active={location.pathname === "/"}>Expenses</Button>
        </Link>
        <Link to="/users">
          <Button active={location.pathname === "/users"}>Users</Button>
        </Link>
      </nav>
    </div>
  );
};

export default Nav;
