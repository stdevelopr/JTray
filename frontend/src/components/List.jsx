import React, { useContext } from "react";
import { JtrayCard } from "./Card.jsx";
import styled from "styled-components";
import { ListContext } from "../ListContext";
import { AddButton } from "./ActionButton.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

const CardContainer = styled.div`
  margin-bottom: 8px;
`;

export const ListBoard = () => {
  const [lists, setList] = useContext(ListContext);
  return (
    <DragDropContext>
      <Droppable droppableId="all-lists" type="list" direction="horizontal">
        {provided => (
          <Board {...provided.droppableProps} ref={provided.innerRef}>
            {lists.map((list, index) => (
              <Draggable
                draggableId={String(list.id)}
                index={index}
                key={list.id}
              >
                {provided => (
                  <ListContainer
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Droppable droppableId={String(list.id)}>
                      {provided => (
                        <div
                          key={list.id}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <h3>{list.title}</h3>
                          {list.cards.map((card, index) => (
                            <Draggable
                              draggableId={String(card.id)}
                              index={index}
                              key={card.id}
                            >
                              {provided => (
                                <CardContainer
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <JtrayCard text={card.text} key={card.id} />
                                </CardContainer>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          <AddButton />
                        </div>
                      )}
                    </Droppable>
                  </ListContainer>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <AddButton list />
          </Board>
        )}
      </Droppable>
    </DragDropContext>
  );
};
