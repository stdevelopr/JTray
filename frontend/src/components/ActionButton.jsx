import React, { useState } from "react";
import Icon from "@material-ui/core/Icon";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useQuery } from "@apollo/react-hooks";
import { useApolloClient } from "@apollo/react-hooks";
// import { ButtonGroup } from "@material-ui/core";
import { Card, Button } from "@material-ui/core";
import TextareaAutosize from "react-textarea-autosize";
import { GET_TRAYS } from "../graphql/queries.graphql";
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

export const AddButton = ({ list, trayId }) => {
  const [openState, setOpenState] = useState(false);
  const [textAreaState, setTextAreaState] = useState("");
  const [addTrayHook, {}] = useMutation(ADD_TRAY);
  const [addCardHook, {}] = useMutation(ADD_CARD);

  const client = useApolloClient();

  const toggleForm = () => {
    setOpenState(!openState);
  };

  const renderButton = () => (
    <ButtonContainer onClick={toggleForm}>
      <Icon>add</Icon>
      <p>{list ? "Add another tray" : "Add another card"}</p>
    </ButtonContainer>
  );

  const resetForm = () => {
    setTextAreaState("");
    toggleForm();
  };

  const updateTraysCache = (client, { data: { addTray } }) => {
    const data = client.readQuery({
      query: GET_TRAYS
    });

    let data_copy = JSON.parse(JSON.stringify(data));

    data_copy.allTrays.push(addTray);

    client.writeQuery({
      query: GET_TRAYS,
      data: data_copy
    });
    resetForm();
  };

  const addCard = (trayId, textAreaState) => {
    // toggleForm();
    let retun = addCardHook({
      variables: { trayId: trayId, text: textAreaState },
      update: resetForm
    });
  };

  const addTray = () => {
    // console.log(textAreaState);
    addTrayHook({
      variables: { title: textAreaState },
      update: updateTraysCache
    });
  };

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
            list ? addTray() : addCard(trayId, textAreaState);
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
  const placeholder = list
    ? "Enter list title..."
    : "Enter a text for this card...";

  return openState ? renderForm() : renderButton();
};
