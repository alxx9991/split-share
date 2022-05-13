import Button from "../ui/Button";

import Card from "../ui/Card";
import classes from "./styles/CreateExpenses.module.css";
import Input from "../ui/Input";
import useSetListName from "../../hooks/useSetListName";

const CreateExpenses = () => {
  const {
    handleListNameChange,
    handleListNameBlur,
    handleCreateKeyPress,
    createDocumentClickHandler,
    error,
    isLoading,
    listNameInputValid,
    formState,
  } = useSetListName("");

  return (
    <main className={classes["create-expenses"]}>
      <Card>
        <h2>Create new expense list</h2>
        <div className={classes["create-expenses__inner"]}>
          <p>
            {error ? (
              <span className={classes.error}>
                An error occured while attempting to create a document. Try
                again?
              </span>
            ) : (
              "You haven't started a new list yet, click the button below to get started!"
            )}
          </p>
          <div className={classes.controls}>
            <Input
              attributes={{
                type: "text",
                className: classes["create-expenses__input"],
                onChange: handleListNameChange,
                onKeyPress: formState.valid ? handleCreateKeyPress : () => {},
                onBlur: handleListNameBlur,
              }}
              valid={listNameInputValid}
              label={"List name:"}
              errorMessage={"List name cannot be empty"}
            ></Input>
            <Button
              onClick={formState.valid ? createDocumentClickHandler : () => {}}
              inactive={!formState.valid || isLoading}
            >
              {isLoading ? "Loading..." : "Create!"}
            </Button>
          </div>

          <p>
            <span className={classes.bold}>Hint!</span> After clicking create,
            you can copy the URL to share your list with others!
          </p>
        </div>
      </Card>
    </main>
  );
};

export default CreateExpenses;
