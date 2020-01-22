import React, { useState } from "react";
import Icon from "@material-ui/core/Icon";
// import { ButtonGroup } from "@material-ui/core";
import { Card, Button } from "@material-ui/core";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";

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

export const AddButton = ({ list }) => {
  const [openState, setOpenState] = useState(false);
  const [textAreaState, setTextAreaState] = useState("");
  const toggleForm = () => {
    setOpenState(!openState);
  };

  const renderButton = () => (
    <ButtonContainer onClick={toggleForm}>
      <Icon>add</Icon>
      <p>{list ? "Add another list" : "Add another card"}</p>
    </ButtonContainer>
  );

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
          variant="contained"
          style={{ color: "white", backgroundColor: "#5aac44" }}
        >
          Add
        </Button>
        <Icon style={{ marginLeft: "8px", cursor: "pointer" }}>close</Icon>
      </ButtonGroup>
    </div>
  );
  const placeholder = list
    ? "Enter list title..."
    : "Enter a text for this card...";

  return openState ? renderForm() : renderButton();
};
