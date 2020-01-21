import React from "react";
import Icon from "@material-ui/core/Icon";
// import { ButtonGroup } from "@material-ui/core";
// import { Card, Button } from "@material-ui/core";
// import TextareaAutosize from "react-textarea-autosize";
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

const openForm = () => {
  console.log("hey");
};

export const AddButton = ({ list }) => {
  return (
    <ButtonContainer onClick={openForm}>
      <Icon>add</Icon>
      <p>{list ? "Add another list" : "Add another card"}</p>
    </ButtonContainer>
  );
};
