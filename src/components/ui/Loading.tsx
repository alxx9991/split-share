import Card from "../ui/Card";
import classes from "./styles/Loading.module.css";
import Button from "./Button";

const Loading: React.FC<{
  errorMessage: string | "";
  loadingMessage: string;
  fetchIsLoading: boolean;
  syncData: () => void;
}> = (props) => {
  return (
    <div className={classes.loading}>
      <Card>
        <div className={classes.loading__inner}>
          <p>
            {props.errorMessage
              ? `Failed to fetch data: ${props.errorMessage}`
              : props.loadingMessage}
          </p>
          <Button
            onClick={() => {
              props.syncData();
            }}
            inactive={props.fetchIsLoading}
          >
            {props.fetchIsLoading ? "Loading..." : "Retry?"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Loading;
