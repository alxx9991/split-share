import React from "react";
import classes from "./styles/Input.module.css";

const Checkbox: React.FC<{
  attributes: React.InputHTMLAttributes<HTMLInputElement>;
  label: string;
}> = (props) => {
  return (
    <div className={`${classes["input--checkbox"]} '${classes.input}`}>
      <div className={classes["input--checkbox__inner"]}>
        <label htmlFor={props.attributes.id}>{props.label}</label>
        <input {...props.attributes} />
      </div>
    </div>
  );
};

export default Checkbox;
