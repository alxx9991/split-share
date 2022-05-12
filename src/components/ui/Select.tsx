import Select, { StylesConfig } from "react-select";
import classes from "./styles/Input.module.css";

const CustomSelect: React.FC<{
  userList: User[];
  isClearable?: boolean;
  isMulti?: boolean;
  onChange?: any;
  onBlur?: (event: any) => void;
  errorText?: string;
  valid?: boolean;
  id: string;
  label: string;
  value?: any;
}> = (props) => {
  const styles: StylesConfig = {
    control: (provided: any, state: any) => {
      if (!props.valid) {
        return {
          ...provided,
          border: "1px solid red",
          backgroundColor: "#ffcccb",
          boxShadow: state.isFocused ? "0 0 0 1px red" : "none",
          "&:hover": {
            border: "1px solid red",
            boxShadow: "0 0 0 1px red",
          },
        };
      }
      return {
        ...provided,
        border: "1px solid #ccc",
        boxShadow: state.isFocused ? "0 0 0 1px var(--color-primary)" : "none",
        "&:hover": {
          boxShadow: "0 0 0 1px var(--color-primary)",
          border: "1px solid var(--color-primary)",
        },
      };
    },
    valueContainer: (provided: any, state: any) => {
      return {
        ...provided,
        width: "20rem",
      };
    },
  };

  const userOptions: { label: string; value: string }[] = [];
  for (let user in props.userList) {
    const name = props.userList[user].name;
    userOptions.push({ label: name, value: name });
  }

  return (
    <div className={classes.input}>
      <label htmlFor={props.id}>{props.label}</label>
      <Select
        options={userOptions}
        styles={styles}
        isClearable={props.isClearable}
        isMulti={props.isMulti}
        onChange={props.onChange}
        onBlur={props.onBlur}
        value={props.value}
      ></Select>
      {!props.valid && (
        <p className={classes["error-text"]}>{props.errorText}</p>
      )}
    </div>
  );
};

export default CustomSelect;
