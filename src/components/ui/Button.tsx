import React from "react";
import classes from "./styles/Button.module.css";

const Button: React.FC<{
  className?: string;
  active?: boolean;
  inactive?: boolean;
  error?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = (props) => {
  const buttonClassesA = props.active
    ? `${classes.button} ${classes["button--active"]}`
    : `${classes.button}`;

  const buttonClassesB = props.inactive ? `${classes["button--greyed"]}` : "";

  const buttonClassesC = props.error ? `${classes["button--error"]}` : "";

  const buttonClasses = `${buttonClassesA} ${buttonClassesB} ${buttonClassesC}`;

  return (
    <button onClick={props.onClick} className={buttonClasses}>
      {props.children}
    </button>
  );
};

export default Button;
