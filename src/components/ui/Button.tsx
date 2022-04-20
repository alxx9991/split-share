import React from "react";
import classes from "./Button.module.css";

const Button: React.FC<{
  className?: string;
  active?: boolean;
  inactive?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = (props) => {
  const buttonClassesA = props.active
    ? `${classes.button} ${classes["button--active"]}`
    : `${classes.button}`;

  const buttonClassesB = props.inactive ? `${classes["button--inactive"]}` : "";

  const buttonClasses = `${buttonClassesA} ${buttonClassesB}`;

  return (
    <button onClick={props.onClick} className={buttonClasses}>
      {props.children}
    </button>
  );
};

export default Button;
