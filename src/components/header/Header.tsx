import classes from "./Header.module.css";

import Nav from "./Nav";
const Header = () => {
  return (
    <>
      <header className={classes.header}>
        <h1>Split Share</h1>
        <Nav></Nav>
      </header>
    </>
  );
};

export default Header;
