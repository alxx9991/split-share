import React from "react";
import classes from "./styles/Input.module.css";

const Input: React.FC<{
  attributes: React.InputHTMLAttributes<HTMLInputElement>;
  label: string;
  errorMessage?: string;
  valid: boolean;
  ref?: React.Ref<HTMLInputElement>;
}> = React.forwardRef((props, ref) => {
  return (
    <div className={classes.input}>
      <label htmlFor={props.attributes.id}>{props.label}</label>
      <input
        {...props.attributes}
        className={props.valid ? "" : classes.invalid_input}
        ref={ref}
      />
      {!props.valid && (
        <p className={classes["error-text"]}>{props.errorMessage}</p>
      )}
    </div>
  );
});

export default Input;
