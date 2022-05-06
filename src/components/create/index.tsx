import Button from "../ui/Button";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { globalActions } from "../../store/globalReducer";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import classes from "./CreateExpenses.module.css";

const CreateExpenses = () => {
  const navigate = useNavigate();

  const createDocumentClickHandler = () => {
    const docID = uuidv4();
    dispatch(globalActions.changedocumentIDReducer({ docID }));
    navigate(`/users/${docID}`);
  };

  const dispatch = useDispatch();

  return (
    <main className={classes["create-expenses"]}>
      <Card>
        <div className={classes["create-expenses__inner"]}>
          <h2>Create new expense list</h2>
          <p>
            You haven't started a new list yet, click the button below to get
            started!
          </p>
          <Button onClick={createDocumentClickHandler}>Create!</Button>
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
