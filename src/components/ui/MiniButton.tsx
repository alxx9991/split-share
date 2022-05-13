import React from "react";
import classes from "./styles/MiniButton.module.css";

const MiniButton: React.FC<{
  src: string;
  alt: string;
  onClick: React.MouseEventHandler;
  loading?: boolean | string;
  error?: boolean | string;
}> = (props) => {
  const buttonClassesA = props.loading
    ? `${classes.button} ${classes["button--loading"]}`
    : `${classes.button}`;
  const buttonClassesB = props.error ? `${classes["button--error"]}` : "";
  const buttonClasses = `${buttonClassesA} ${buttonClassesB}`;
  return (
    <button className={buttonClasses} onClick={props.onClick}>
      <img src={props.src} alt={props.alt} />
    </button>
  );
};

export default MiniButton;
