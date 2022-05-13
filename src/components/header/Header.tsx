import classes from "./Header.module.css";

import Nav from "./Nav";
const Header = () => {
  return (
    <>
      <header className={classes.header}>
        <div className={classes["header-content"]}>
          <h1>Share Split</h1>
          <Nav></Nav>
        </div>
      </header>
    </>
  );
};

export default Header;
