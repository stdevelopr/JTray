import React, { useState } from "react";
import Icon from "@material-ui/core/Icon";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "@apollo/react-hooks";
import { useApolloClient } from "@apollo/react-hooks";
// import { ButtonGroup } from "@material-ui/core";
import { Card, Button } from "@material-ui/core";
import TextareaAutosize from "react-textarea-autosize";
import { GET_TRAYS, GET_USER_INFO } from "../graphql/queries.graphql";
import { ADD_CARD, ADD_TRAY } from "../graphql/mutations.graphql";
import styled from "styled-components";

// styled components
// ###############################################
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 3px;
  height: 36px;
  width: 272px;
  paddinleft: 10px;
`;

const ButtonGroup = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
`;
// #####################################################

export const AddButton = ({ list, trayId, pollId, userId, admin }) => {
  const [openState, setOpenState] = useState(false);
  const [textAreaState, setTextAreaState] = useState("");
  // const {
  //   data: { userId, admin }
  // } = useQuery(GET_USER_INFO);
  const [addTrayHook, {}] = useMutation(ADD_TRAY);
  const [addCardHook, {}] = useMutation(ADD_CARD);

  const client = useApolloClient();

  // fucntion to open and close the text area
  const toggleForm = () => {
    setOpenState(!openState);
  };

  // function to reset the text area and close it
  const resetForm = () => {
    setTextAreaState("");
    toggleForm();
  };

  // function to get all the trays from cache and add a new one
  const updateTraysCache = (client, { data: { addTray } }) => {
    const data = client.readQuery({
      query: GET_TRAYS,
      variables: { pollId: pollId }
    });

    let data_copy = JSON.parse(JSON.stringify(data));

    data_copy.pollTrays.push(addTray);

    client.writeQuery({
      query: GET_TRAYS,
      variables: { pollId: pollId },
      data: data_copy
    });
    resetForm();
  };

  // add a new card and automatically update the cache by the id mapping
  const addCard = (trayId, textAreaState) => {
    addCardHook({
      variables: { trayId: trayId, text: textAreaState, userId },
      update: resetForm
    });
  };

  // add a new tray and update the cache through a custom function
  const addTray = pollId => {
    addTrayHook({
      variables: { title: textAreaState, pollId: pollId, userId },
      update: updateTraysCache
    });
  };

  // render a button to insert new item
  const renderButton = () => (
    <ButtonContainer onClick={toggleForm}>
      <Icon>add</Icon>
      <p>{list ? "Add another tray" : "Add another card"}</p>
    </ButtonContainer>
  );

  // variable to display a text inside the text area
  const placeholder = list
    ? "Enter list title..."
    : "Enter a text for this card...";

  // render a text area
  const renderForm = () => (
    <div>
      <Card
        style={{
          overflow: "visible",
          height: "85px",
          minWidth: "272px",
          padding: "6px 8px 2px"
        }}
      >
        <TextareaAutosize
          placeholder={placeholder}
          autoFocus
          onBlur={toggleForm}
          value={textAreaState}
          onChange={t => setTextAreaState(t.target.value)}
          style={{
            resize: "none",
            width: "100%",
            overflow: "hidden",
            outline: "none",
            border: "none"
          }}
        />
      </Card>
      <ButtonGroup>
        <Button
          type="button"
          variant="contained"
          style={{ color: "white", backgroundColor: "#5aac44" }}
          onMouseDown={e => {
            e.preventDefault();
            list ? addTray(pollId) : addCard(trayId, textAreaState);
          }}
        >
          Add
        </Button>
        <Icon
          style={{ marginLeft: "8px", cursor: "pointer" }}
          onMouseDown={resetForm}
        >
          close
        </Icon>
      </ButtonGroup>
    </div>
  );

  return openState ? renderForm() : renderButton();
};
