import React, { useState, useEffect, useRef } from "react";
import Modal from "@material-ui/core/Modal";
import { DELETE_POLL } from "../graphql/mutations.graphql";
import { GET_USER_POLLS, GET_PUBLIC_POLLS } from "../graphql/queries.graphql";
import { Card } from "@material-ui/core";
import TextareaAutosize from "react-textarea-autosize";
import Fade from "@material-ui/core/Fade";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import styles from "./PollModal.module.scss";
import Backdrop from "@material-ui/core/Backdrop";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_POLL } from "../graphql/mutations.graphql";

export default function PollModal({
  open,
  setOpen,
  userId,
  pollId,
  pollTitle,
  pollDescription,
  pollVisibility
}) {
  const [titleEdit, setTitleEdit] = useState(pollTitle);
  const [descriptionEdit, setDescriptionEdit] = useState(pollDescription);
  const [visibilityEdit, setVisibilityEdit] = useState(pollVisibility);
  const [deletePollHook, {}] = useMutation(DELETE_POLL);
  const [updatePollHook, {}] = useMutation(UPDATE_POLL);

  const handleEdit = () => {
    updatePollHook({
      variables: {
        pollId: pollId,
        pollTitle: titleEdit,
        annotations: descriptionEdit,
        visibility: visibilityEdit
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
            <div className={styles.pollTitle}>
              <h1>{pollTitle}</h1>
            </div>
            <div className={styles.editWrapper}>
              <FormLabel component="legend">Title</FormLabel>
              <Card
                className={styles.card}
                style={{
                  clear: "right",
                  overflow: "visible",
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
                    border: "none"
                  }}
                />
              </Card>
              <FormLabel component="legend" className={styles.description}>
                Description
              </FormLabel>
              {/* <div className={styles.description}>Description</div> */}
              <Card
                className={styles.card}
                style={{
                  clear: "right",
                  overflow: "visible",
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
                    border: "none"
                  }}
                />
              </Card>
              <div className={styles.visibility}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Visibility</FormLabel>
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={visibilityEdit}
                    onChange={e => setVisibilityEdit(e.target.value)}
                  >
                    <FormControlLabel
                      value="public"
                      control={<Radio />}
                      label="Public"
                    />
                    {/* <div>
                      <FormControlLabel
                        value="password"
                        control={<Radio />}
                        label="Public with password"
                      />
                      <TextField
                        // style={{ verticalAlign: "baseline" }}
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                      />
                    </div> */}
                    <FormControlLabel
                      value="private"
                      control={<Radio />}
                      label="Private"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className={styles.saveWrapper}>
                <button className={styles.editButton} onClick={handleEdit}>
                  Save
                </button>
              </div>
            </div>
            <hr className={styles.horizontalLine} />
            <h2 id="transition-modal-title" style={{ textAlign: "center" }}>
              Delete
            </h2>
            <span>Delete poll and all its contents?</span>
            <div className={styles.deleteSection}>
              {/* <h3 id="transition-modal-title" className={styles.deleteText}>
                Delete Poll and all its contents?
              </h3> */}

              <button
                onClick={() => {
                  deletePoll();
                  setOpen(false);
                }}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
