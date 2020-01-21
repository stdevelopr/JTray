import React, { useContext } from "react";
import { JtrayCard } from "./Card.jsx";
import styled from "styled-components";
import { ListContext } from "../ListContext";
import { AddButton } from "./ActionButton.jsx";

const ListContainer = styled.div`
  background-color: #dfe3e6;
  border-radius: 3px;
  width: 300px;
  height: 100%;
  padding: 8px;
  margin-right: 8px;
`;

const Board = styled.div`
  display: flex;
  height: 100%;
`;

export const ListBoard = () => {
  const [lists, setList] = useContext(ListContext);
  return (
    <Board>
      {lists.map(list => (
        <ListContainer key={list.id}>
          <h3>{list.title}</h3>
          {list.cards.map(card => (
            <JtrayCard text={card.text} key={card.id} />
          ))}
          <AddButton />
        </ListContainer>
      ))}
      <AddButton list />
    </Board>
  );
};
