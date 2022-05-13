import Card from "../ui/Card";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import classes from "./styles/HomePage.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../ui/Button";
import useSetListName from "../../hooks/useSetListName";

import Input from "../ui/Input";
import MiniButton from "../ui/MiniButton";

const HomePage = () => {
  const docID = useParams().docID;
  const listName = useSelector((state: RootState) => state.global.listName);

  const {
    formState,
    handleListNameChange,
    handleListNameBlur,
    handleKeyPress,
    handleSaveClick,
    isEditing,
    isLoading,
    listNameInputValid,
    error,
    handleCancelEdit,
    handleEditClick,
  } = useSetListName(listName);

  return (
    <div className={classes.home}>
      <Card>
        <div className={classes.home__header}>
          {isEditing ? (
            <>
              <Input
                label={"Edit List Name"}
                attributes={{
                  type: "text",
                  value: formState.enteredListName,
                  onChange: handleListNameChange,
                  onBlur: handleListNameBlur,
                  onKeyPress: handleKeyPress,
                }}
                valid={listNameInputValid}
                errorMessage={"List name cannot be empty"}
              ></Input>
              <MiniButton
                src={
                  isLoading
                    ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAAeElEQVRIie2RMQqAMBAEh7zD1Hm7Ilhb+CMV9ANaGJsjRJSz24Etwk22uAMhhBAviUAP7DkDkP52I7AAh8maZ7bIze0LwzudKXN194qwmTI3N1DneJh/dgMwVYTRvF3dxHVwu44ZaMwHdzdyHXzLaQtFf7tCCCHKnI9xbjyljE9JAAAAAElFTkSuQmCC"
                    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAA/0lEQVRYhe2UTVKDQBBG3xmiwUBFXZgDxMNkn324aqLlD0jUWJWDkCymqUymaBg0oSydbwX1KF7T3QOEhIT84YyAhcImwPzc8hzYAanD7oAtUAKzc8ivgBeRvwGJxW6BL2FLYNCn/AbYCFv9O/mnsIe+5deO/KJv+cdvkD/6yBeYs+vL7HOeO3zcVZ4qL9JYm/zdkl+2yQEiDq0sOG6ly+7R2z4CMmEZZkTeafoqm5XKMwmwFvYEDLvIfYqYWvJS7m15IewZ07Vvp66Ipg7EmFHsMKP5kVwrwr6eKuyVjjNvi7187sLVsfiU8irVVmfU/wc0dtJE6HNtYiEhId7ZA1WHf1ol9U90AAAAAElFTkSuQmCC"
                }
                loading={isLoading || !listNameInputValid}
                alt="save"
                error={error}
                onClick={handleSaveClick}
              ></MiniButton>
              <MiniButton
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAAr0lEQVRIie2S0QnCMBCGP4zgIOoQ2lWcRXSD4g6le7iKzqA+lNaHXCEES89w9yJ+cDSB3P8lTeCXOXmHD97hLoI03FyQh5sKPoVrqwPuQAtUHoK8LsBSK9EQgDVwBB6JRHWSb9mLpJfxrKSEsb/RLCphI703zU5KWIngVdg/y5bkBAsHwUG+V4dsKuBJfEU7q9BAvNizhA9APbU4f57a+Vi9hAdLQUe80AbD3/LHjjcZMGbbycYkrwAAAABJRU5ErkJggg=="
                alt="return"
                onClick={handleCancelEdit}
              ></MiniButton>
            </>
          ) : (
            <>
              <h2>{listName}</h2>
              <MiniButton
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAABzUlEQVRIia3VO4tTQRQA4M9FooWSXnwsFmIj2LmiqFhZirq4a0BYlUUQ8f1YcRX8GVZrqaCVCBZWIij+BR+NKKKFLjZudrMW91wyuSTBSXIgMHOSe77MmUmG0cUOPMIT7B9h3Y7YhZ9YjVcTJ0aN1LAZHxJo5NgUPmJ7D2wZp4ZFNuBLFPyMcWwJuLqygffsMOrYiW8VbGsX7PEgyFH8xRuM9cE+JdDDXOQYlnT2vtYD2xbjHzH/7zjeBbmP14r96oaNY3cOMqnY1GVMJ0jZmheRq2L1HORkgkxF7l6CLGqfqrKNX3E5B5kOpJkg8xVkX+Rv4W2sYmMO0ohVNGNVcLcPUuZP5yBT2u1qRO5mUuwPDkb+WpK/MyxyowdyNcnP5SAzWNF5hKvIgS7I7RxkMpBmjClaURb7jb2Rvx65Fi7lIPAqHp6J+VwPpNyTFi7mInXFr34R6zCbIL8wEZ8r29XChVyEolWreJbkDvVBzg+CwEIUOZfk1mNPjK8kyOygyBi+R5FNlfdq2qdupfJFsmNC+yY8EthZPFXsWbmSM8Mg8EDntdtK5kuK09jo+XRGvEsKryrauKA4IFl/8/1ireJKXoOXeI73ilWNNP4B0Rm6kC6KEsYAAAAASUVORK5CYII="
                alt="edit"
                onClick={handleEditClick}
              ></MiniButton>
            </>
          )}
        </div>
        {error && isEditing && (
          <p className={classes["home-error"]}>
            Failed to change list name: {error}
          </p>
        )}
        <div className={classes.home__inner}>
          <p>
            Welcome to Share Split! If you haven't already, add your first user
            to get started!
          </p>
          <Link to={`/${docID}/users`}>
            <Button>Go to Users &#10132;</Button>
          </Link>
          <Link to={`/${docID}/expenses`}>
            <Button>Go to Expenses &#10132;</Button>
          </Link>
          <div className={classes.share}>
            <p>Copy this URL to save this list and share with others:</p>
            <Card>
              <a
                href={`localhost:3000/${docID}`}
              >{`localhost:3000/${docID}`}</a>
            </Card>
            <p>
              <span className={classes.bold}>IMPORTANT!!</span> Do not lose this
              link or you will be unable to restore your data
            </p>
            <Link to={`/`}>
              <Button>Create New List &#10132;</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
