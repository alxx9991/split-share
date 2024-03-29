import classes from "./Header.module.css";

import Nav from "./Nav";
const Header = () => {
  return (
    <>
      <header className={classes.header}>
        <div className={classes["header-content"]}>
          <h1>
            Share <span className={classes.highlight}>Split</span>
          </h1>
          <Nav></Nav>
        </div>
      </header>
    </>
  );
};

export default Header;
