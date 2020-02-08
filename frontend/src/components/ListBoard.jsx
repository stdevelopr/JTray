import React from "react";
import { JtrayCard } from "./Card.jsx";
import { AddButton } from "./ActionButton.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import { GET_TRAYS } from "../graphql/queries.graphql";
import { SWAP_CARD, SWAP_TRAY } from "../graphql/mutations.graphql";
import { useApolloClient } from "@apollo/react-hooks";
import "./ListBoard.scss";

// function to render the board based on array of trays
const renderLists = (lists, onDragEnd) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-lists" type="list" direction="horizontal">
        {provided => (
          <div
            className="board"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {lists.map((list, index) => (
              <Draggable
                draggableId={String(list.id)}
                index={index}
                key={list.id}
              >
                {(provided, snapshot) => (
                  <div
                    className={snapshot.isDragging ? "move" : "static"}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <h3 {...provided.dragHandleProps}>{list.title}</h3>
                    <Droppable droppableId={String(list.id)}>
                      {provided => (
                        <div
                          key={list.id}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {list.cards.map((card, index) => (
                            <Draggable
                              draggableId={String(card.id)}
                              index={index}
                              key={card.id}
                            >
                              {(provided, snapshot) => (
                                <div
                                  className="card"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <JtrayCard
                                    text={card.text}
                                    key={card.id}
                                    snapshot={snapshot}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          <AddButton trayId={list.id} />
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <AddButton list />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

// function to simulate the response from the server to an drag and drop action
const optimisticResponseCard = (data, source, destination) => {
  // variable to simulate the response from the server
  let optimisticResponse = {};

  // create a pre response based on the action
  if (destination.droppableId == source.droppableId) {
    // get the cards from the tray selected tray
    const cards = data.allTrays.filter(e => e.id == source.droppableId)[0]
      .cards;
    let cardsCopy = [...cards];
    // copy the value and remove the dragged card
    let fromCard = cardsCopy[source.index];
    cardsCopy.splice(source.index, 1);
    // add the card to the destination index
    cardsCopy.splice(destination.index, 0, fromCard);

    // this is the expected response from the server if the card is dropped in the same tray
    optimisticResponse = {
      swapCard: {
        __typename: "SwapCard",
        trays: [
          { id: source.droppableId, cards: cardsCopy, __typename: "Tray" }
        ]
      }
    };
  } else {
    // get the trays where the action is happening
    const fromTrayCards = data.allTrays.filter(
      e => e.id == source.droppableId
    )[0].cards;
    const toTrayCards = data.allTrays.filter(
      e => e.id == destination.droppableId
    )[0].cards;
    let fromCardsCopy = [...fromTrayCards];
    let toCardsCopy = [...toTrayCards];

    // copy the value and remove the dragged card
    let fromCard = fromCardsCopy[source.index];
    fromCardsCopy.splice(source.index, 1);

    // add the card to the destination array index
    toCardsCopy.splice(destination.index, 0, fromCard);

    // this is the expected response from the server if the card is dropped in another tray
    optimisticResponse = {
      swapCard: {
        __typename: "SwapCard",
        trays: [
          {
            id: source.droppableId,
            cards: fromCardsCopy,
            __typename: "Tray"
          },
          {
            id: destination.droppableId,
            cards: toCardsCopy,
            __typename: "Tray"
          }
        ]
      }
    };
  }

  return optimisticResponse;
};

const updateSwapTrayCache = (client, data, fromIndex, toIndex) => {
  let trays = data.allTrays;
  // copy the data and modify the indexes
  let trays_copy = JSON.parse(JSON.stringify(trays));

  // get the dragged tray
  let dragged_tray = trays_copy[fromIndex];
  // remove the dragged tray
  trays_copy.splice(fromIndex, 1);
  // insert the removed tray into a new position
  trays_copy.splice(toIndex, 0, dragged_tray);

  client.writeQuery({
    query: GET_TRAYS,
    data: { allTrays: trays_copy }
  });
};

// React component
export const ListBoard = () => {
  const [swapCards, ob] = useMutation(SWAP_CARD);
  const { loading, error, data } = useQuery(GET_TRAYS);
  const [swapTrays, ob2] = useMutation(SWAP_TRAY);
  const client = useApolloClient();

  // function to execute at the end of a drag and drop action
  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;
    const data = client.readQuery({
      query: GET_TRAYS
    });

    // if the action is on lists
    if (type == "list" && source.index != destination.index) {
      swapTrays({
        variables: {
          fromIndex: source.index,
          toIndex: destination.index
        },
        update: updateSwapTrayCache(
          client,
          data,
          source.index,
          destination.index
        )
      });
    }

    // if the action is on cards
    if (destination && type == "DEFAULT") {
      swapCards({
        variables: {
          fromTrayId: source.droppableId,
          toTrayId: destination.droppableId,
          fromCardIndex: source.index,
          toCardIndex: destination.index
        },
        optimisticResponse: optimisticResponseCard(data, source, destination)
      });
    }
  };
  if (loading) return "loading...";
  if (error) return "error :(";

  return renderLists(data["allTrays"], onDragEnd);
};
