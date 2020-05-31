import React, { useState, useEffect, useRef } from "react";
import Modal from "@material-ui/core/Modal";
import { DELETE_POLL } from "../graphql/mutations.graphql";
import { GET_USER_POLLS, GET_PUBLIC_POLLS } from "../graphql/queries.graphql";
import { Card } from "@material-ui/core";
import TextareaAutosize from "react-textarea-autosize";
import Fade from "@material-ui/core/Fade";
import styles from "./TrayModal.module.scss";
import Backdrop from "@material-ui/core/Backdrop";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_POLL } from "../graphql/mutations.graphql";

export default function PollModal({
  open,
  setOpen,
  userId,
  pollId,
  pollTitle,
  pollDescription
}) {
  const [titleEdit, setTitleEdit] = useState(pollTitle);
  const [descriptionEdit, setDescriptionEdit] = useState(pollDescription);
  const [deletePollHook, {}] = useMutation(DELETE_POLL);
  const [updatePollHook, {}] = useMutation(UPDATE_POLL);

  const handleEdit = () => {
    updatePollHook({
      variables: {
        pollId: pollId,
        pollTitle: titleEdit,
        annotations: descriptionEdit
      },
      refetchQueries: [
        { query: GET_USER_POLLS, variables: { userId: userId } },
        { query: GET_PUBLIC_POLLS }
      ]
    });
    setOpen(false);
  };

  const deletePoll = () => {
    deletePollHook({
      variables: {
        pollId: pollId
      },
      refetchQueries: [
        { query: GET_USER_POLLS, variables: { userId: userId } },
        { query: GET_PUBLIC_POLLS }
      ]
    });
  };

  return (
    <div>
      {" "}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.modal}
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 100
        }}
      >
        <Fade in={open}>
          <div className={styles.paper}>
            <div className={styles.editWrapper}>
              <button className={styles.editButton} onClick={handleEdit}>
                Save
              </button>
              <div>Title</div>
              <Card
                className={styles.card}
                style={{
                  clear: "right",
                  overflow: "visible",
                  height: "30px",
                  minWidth: "272px",
                  padding: "6px 8px 2px"
                }}
              >
                <TextareaAutosize
                  autoFocus
                  //   onBlur={toggleForm}
                  value={titleEdit}
                  onChange={t => setTitleEdit(t.target.value)}
                  style={{
                    resize: "none",
                    overflow: "hidden",
                    minWidth: "272px",
                    outline: "none",
                    border: "none",
                    position: "absolute",
                    zIndex: 10
                  }}
                />
              </Card>
              <div>Description</div>
              <Card
                className={styles.card}
                style={{
                  clear: "right",
                  overflow: "visible",
                  marginTop: "5px",
                  height: "30px",
                  minWidth: "272px",
                  padding: "6px 8px 2px"
                }}
              >
                <TextareaAutosize
                  autoFocus
                  //   onBlur={toggleForm}
                  value={descriptionEdit}
                  onChange={t => setDescriptionEdit(t.target.value)}
                  style={{
                    resize: "none",
                    overflow: "hidden",
                    minWidth: "272px",
                    outline: "none",
                    border: "none",
                    position: "absolute",
                    zIndex: 10
                  }}
                />
              </Card>
            </div>
            <h2 id="transition-modal-title">
              Delete Poll and all its content?
            </h2>

            <div
              onClick={() => {
                deletePoll();
                setOpen(false);
              }}
              className={styles.deleteItem}
            >
              Delete Poll
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
