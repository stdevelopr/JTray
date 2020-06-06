import React, { useState, useEffect, useRef } from "react";
import Modal from "@material-ui/core/Modal";
import { Card } from "@material-ui/core";
import TextareaAutosize from "react-textarea-autosize";
import FormLabel from "@material-ui/core/FormLabel";
import Fade from "@material-ui/core/Fade";
import styles from "./TrayModal.module.scss";
import Backdrop from "@material-ui/core/Backdrop";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_TRAY } from "../graphql/mutations.graphql";

export default function TrayModal({
  open,
  setOpen,
  deleteTrayCallBack,
  trayId,
  trayTitle
}) {
  const [textEdit, setTextEdit] = useState(trayTitle);
  const [updateTrayHook, {}] = useMutation(UPDATE_TRAY);
  const handleEdit = () => {
    updateTrayHook({
      variables: {
        trayId: trayId,
        text: textEdit
      }
    });
    setOpen(false);
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
              <h1 style={{ textAlign: "center" }}>{trayTitle}</h1>
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
                  // onBlur={toggleForm}
                  value={textEdit}
                  onChange={t => setTextEdit(t.target.value)}
                  style={{
                    resize: "none",
                    overflow: "hidden",
                    minWidth: "272px",
                    outline: "none",
                    border: "none"
                  }}
                />
              </Card>
            </div>
            <div style={{ margin: "20px", textAlign: "center" }}>
              <button className={styles.editButton} onClick={handleEdit}>
                Save
              </button>
            </div>
            <h2 id="transition-modal-title" style={{ textAlign: "center" }}>
              Delete
            </h2>
            <span>Delete tray and all its cards?</span>
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => {
                  deleteTrayCallBack(trayId);
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
