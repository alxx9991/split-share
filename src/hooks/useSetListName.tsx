import useUpdateData from "../hooks/useUpdateData";
import { UpdateType } from "../enums/updateType";
import { cloneDeep } from "lodash";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { globalActions } from "../store/globalReducer";
import { useNavigate } from "react-router-dom";

const useSetListName = (listname: string) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    updateDataReducer,
    isLoading,
    error,
    setIsLoading,
    setError,
    addDocument,
  } = useUpdateData();

  const [formState, setFormState] = useState({
    enteredListName: listname ? listname : "",
    valid: listname ? true : false,
    touched: false,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleListNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => {
      const newState = cloneDeep(prevState);
      newState.enteredListName = e.target.value;
      newState.touched = true;
      newState.valid = e.target.value.trim().length > 0;
      return newState;
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormState((prevState) => {
      const newState = cloneDeep(prevState);
      newState.touched = false;
      newState.valid = true;
      newState.enteredListName = listname ? listname : "";
      return newState;
    });
    setIsEditing(false);
    setError(null);
  };

  const handleSaveClick = async () => {
    if (formState.valid) {
      const res = await updateDataReducer(UpdateType.CHANGE_NAME, {
        newListName: formState.enteredListName,
      });
      setIsLoading(false);
      if (res) {
        setIsEditing(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveClick();
    }
  };

  const handleCreateKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createDocumentClickHandler();
    }
  };

  const handleListNameBlur = () => {
    setFormState((prevState) => {
      const newState = cloneDeep(prevState);
      newState.touched = true;
      newState.valid = newState.enteredListName.trim().length > 0;
      return newState;
    });
  };

  const createDocumentClickHandler = async () => {
    const docID = "docID=" + uuidv4();
    addDocument(docID, formState.enteredListName)
      .then((res) => {
        dispatch(globalActions.setDocIDReducer({ docID }));
        navigate(`/${docID}`);
        setIsLoading(false);
        console.log(res);
      })
      .catch((err: any) => {
        setError(err);
        setIsLoading(false);
        console.error(err);
      });
  };

  const listNameInputValid = !formState.touched || formState.valid;

  return {
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
    createDocumentClickHandler,
    handleCreateKeyPress,
  };
};

export default useSetListName;
