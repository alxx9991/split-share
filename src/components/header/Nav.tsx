import { Link } from "react-router-dom";
import Button from "../ui/Button";
import classes from "./Nav.module.css";

const Nav = () => {
  return (
    <div className={classes.nav}>
      <nav>
        <Link to="/">
          {" "}
          <Button active={false}>Expenses</Button>
        </Link>
        <Link to="/users">
          <Button active={false}>Users</Button>
        </Link>
      </nav>
    </div>
  );
};

export default Nav;
