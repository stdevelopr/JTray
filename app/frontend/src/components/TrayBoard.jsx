import React, { useState } from "react";
import { JCard } from "./JCard.jsx";
import { AddButton } from "./ActionButton.jsx";
import TrayModal from "./TrayModal.jsx";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";
import { GET_TRAYS } from "../graphql/queries.graphql";
import {
  SWAP_CARD,
  SWAP_TRAY,
  DELETE_TRAY
} from "../graphql/mutations.graphql";
import { useApolloClient } from "@apollo/react-hooks";
import styles from "./TrayBoard.module.scss";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

// function to render the board based on array of trays
const renderTrays = (
  lists,
  onDragEnd,
  admin,
  userId,
  pollId,
  deleteTray,
  jiraInfo,
  openTrayModal,
  setOpenTrayModal,
  trayId,
  setTrayId,
  trayTitle,
  setTrayTitle
) => {
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-lists" type="list" direction="horizontal">
          {provided => (
            <div
              className={styles.board}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {lists.map((list, index) => (
                <Draggable
                  draggableId={String(list.id)}
                  isDragDisabled={!admin}
                  index={index}
                  key={list.id}
                >
                  {(provided, snapshot) => (
                    <div
                      className={
                        snapshot.isDragging ? styles.move : styles.static
                      }
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className={admin ? styles.listTitle : null}>
                        <h3
                          {...provided.dragHandleProps}
                          className={styles.title}
                        >
                          {list.title}
                        </h3>
                        {admin ? (
                          <IconButton
                            aria-label="settings"
                            // onClick={e => deleteTray(list.id)}
                            onClick={e => {
                              setOpenTrayModal(!openTrayModal);
                              setTrayId(list.id);
                              setTrayTitle(list.title);
                            }}
                            className={styles.verticalIcon}
                          >
                            <MoreHorizIcon />
                          </IconButton>
                        ) : (
                          ""
                        )}
                      </div>
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
                                isDragDisabled={!admin}
                                index={index}
                                key={card.id}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    className={styles.card}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <JCard
                                      text={card.text}
                                      key={card.id}
                                      trayId={list.id}
                                      trayTitle={list.title}
                                      cardId={card.id}
                                      snapshot={snapshot}
                                      userId={userId}
                                      admin={admin}
                                      favoritedBy={card.favoritedBy}
                                      jiraInfo={jiraInfo}
                                      visibility={list.visibility}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {admin ? (
                              <AddButton
                                trayId={list.id}
                                userId={userId}
                                admin={admin}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {admin ? (
                <AddButton pollId={pollId} userId={userId} admin={admin} list />
              ) : (
                ""
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {openTrayModal && (
        <TrayModal
          open={openTrayModal}
          setOpen={setOpenTrayModal}
          deleteTrayCallBack={deleteTray}
          trayId={trayId}
          trayTitle={trayTitle}
        />
      )}
    </div>
  );
};

// function to simulate the response from the server to an drag and drop action
const optimisticResponseCard = (data, source, destination) => {
  // variable to simulate the response from the server
  let optimisticResponse = {};
  // create a pre response based on the action
  if (destination.droppableId == source.droppableId) {
    // get the cards from the tray
    const cards = data.pollTrays.filter(e => e.id == source.droppableId)[0]
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
    const fromTrayCards = data.pollTrays.filter(
      e => e.id == source.droppableId
    )[0].cards;
    const toTrayCards = data.pollTrays.filter(
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

const updateSwapTrayCache = (client, data, fromIndex, toIndex, pollId) => {
  let trays = data.pollTrays;
  // copy the data and modify the indexes
  let trays_copy = JSON.parse(JSON.stringify(trays));

  // get the dragged tray
  let dragged_tray = trays_copy[fromIndex];
  // remove the dragged tray
  trays_copy.splice(fromIndex, 1);
  // insert the removed tray into a new position
  trays_copy.splice(toIndex, 0, dragged_tray);
  // write in the cache
  client.writeQuery({
    query: GET_TRAYS,
    variables: { pollId: pollId },
    data: { pollTrays: trays_copy }
  });
};

// React component
export const TrayBoard = ({ userId, admin, pollId, jiraInfo }) => {
  const [openTrayModal, setOpenTrayModal] = useState(false);
  const [trayId, setTrayId] = useState(null);
  const [trayTitle, setTrayTitle] = useState(null);
  const [swapCards, {}] = useMutation(SWAP_CARD);
  const [deleteTrayHook, {}] = useMutation(DELETE_TRAY);

  const { loading, error, data } = useQuery(GET_TRAYS, {
    variables: { pollId: pollId }
  });

  const [swapTrays, ob2] = useMutation(SWAP_TRAY);
  const client = useApolloClient();

  const deleteTray = trayId => {
    deleteTrayHook({
      variables: {
        trayId: trayId
      },
      refetchQueries: [{ query: GET_TRAYS, variables: { pollId: pollId } }]
    });
  };

  // function to execute at the end of a drag and drop action
  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;

    // if the action is on lists
    if (type == "list" && destination && source.index != destination.index) {
      swapTrays({
        variables: {
          pollId: pollId,
          fromIndex: source.index,
          toIndex: destination.index
        },
        update: updateSwapTrayCache(
          client,
          data,
          source.index,
          destination.index,
          pollId
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
  if (loading) return "Loading...";
  if (error) {
    console.log(error);
    return "error :(";
  }

  return renderTrays(
    data.pollTrays,
    onDragEnd,
    admin,
    userId,
    pollId,
    deleteTray,
    jiraInfo,
    openTrayModal,
    setOpenTrayModal,
    trayId,
    setTrayId,
    trayTitle,
    setTrayTitle
  );
};
