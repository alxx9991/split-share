import Button from "../ui/Button";
import { useDispatch } from "react-redux";
import { globalActions } from "../../store/globalReducer";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import classes from "./CreateExpenses.module.css";
import useHTTP from "../../hooks/useHTTP";
import { v4 as uuidv4 } from "uuid";

const CreateExpenses = () => {
  const navigate = useNavigate();

  const { isLoading, setIsLoading, error, setError, get, post } = useHTTP();

  const createDocumentClickHandler = async () => {
    post(
      "https://split-share-89844-default-rtdb.asia-southeast1.firebasedatabase.app/documents.json",
      {
        data: { key: uuidv4(), expenses: [], users: [] },
      }
    )
      .then((res) => {
        dispatch(
          globalActions.changedocumentIDReducer({ docID: res.data.name })
        );
        navigate(`/users/${res.data.name}`);
        setIsLoading(false);
        console.log(res);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
        console.error(err);
      });
  };

  const dispatch = useDispatch();

  return (
    <main className={classes["create-expenses"]}>
      <Card>
        <div className={classes["create-expenses__inner"]}>
          <h2>Create new expense list</h2>
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
          <Button onClick={createDocumentClickHandler}>
            {isLoading ? "Loading..." : "Create!"}
          </Button>
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
