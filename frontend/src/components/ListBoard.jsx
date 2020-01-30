import React from "react";
import { JtrayCard } from "./Card.jsx";
import styled from "styled-components";
import { AddButton } from "./ActionButton.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import { GET_TRAYS } from "../graphql/queries.graphql";
import { SWAP_CARD } from "../graphql/mutations.graphql";

// styled components
// #########################################
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
// #######################################

export const ListBoard = () => {
  const [swapCards, ob] = useMutation(SWAP_CARD);
  const { loading, error, data } = useQuery(GET_TRAYS);
  console.log("ji", ob, data);

  const swapCacheUpdate = (client, { data: { swapCard } }) => {
    console.log("client", client);
    console.log("swapCardd", swapCard);
  };

  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;
    if (destination) {
      swapCards({
        variables: {
          fromTrayId: source.droppableId,
          toTrayId: destination.droppableId,
          fromCardIndex: source.index,
          toCardIndex: destination.index
        },
        update: swapCacheUpdate
      });
    }
  };
  if (!loading) {
    let lists = data["allTrays"];

    return (
      <DragDropContext onDragEnd={onDragEnd}>
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
                            <AddButton trayId={list.id} />
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
  } else return "OK";
};
