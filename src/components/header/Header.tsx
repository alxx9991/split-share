import Button from "../ui/Button";
import classes from "./Header.module.css";
// import bannerImage from "../../assets/banner.jpg";
import Nav from "./Nav";
const Header = () => {
  return (
    <>
      <header className={classes.header}>
        <h1>Split Share</h1>
        <Button>Finalise</Button>
      </header>
      {/* <div className={classes.banner}>
        <img src={bannerImage} alt="banner" />
      </div> */}
      <Nav></Nav>
    </>
  );
};

export default Header;
