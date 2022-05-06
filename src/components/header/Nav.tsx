import { Link } from "react-router-dom";
import Button from "../ui/Button";
import classes from "./Nav.module.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Nav = () => {
  const location = useLocation();
  const docID = useSelector((state: RootState) => state.global.docID);
  console.log(docID);

  return (
    <div className={classes.nav}>
      <nav>
        <Link to={`/users/${docID}`}>
          <Button active={location.pathname === `/users/${docID}`}>
            Users
          </Button>
        </Link>
        <Link to={`/expenses/${docID}`}>
          {" "}
          <Button active={location.pathname === `/expenses/${docID}`}>
            Expenses
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default Nav;
