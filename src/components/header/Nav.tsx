import { Link } from "react-router-dom";
import Button from "../ui/Button";
import classes from "./Nav.module.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Nav = () => {
  const location = useLocation();
  const docID = useSelector((state: RootState) => state.global.docID);
  return (
    <>
      {docID ? (
        <div className={classes.nav}>
          <nav>
            <Link to={`/${docID}`}>
              <Button active={location.pathname === `/${docID}`}>Home</Button>
            </Link>
            <Link to={`/${docID}/users`}>
              <Button active={location.pathname === `/${docID}/users`}>
                Users
              </Button>
            </Link>
            <Link to={`/${docID}/expenses`}>
              {" "}
              <Button active={location.pathname === `/${docID}/expenses`}>
                Expenses
              </Button>
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
};

export default Nav;
