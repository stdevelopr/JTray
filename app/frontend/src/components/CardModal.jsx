import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import styles from "./CardModal.module.scss";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_CARD } from "../graphql/mutations.graphql";

export default function SimpleModal({ trayId, cardId }) {
  const [open, setOpen] = useState(false);
  const [deleteCardHook, {}] = useMutation(DELETE_CARD);
  // const [modalX, setModalX] = useState(0);

  const handleOpen = e => {
    setOpen(true);
    console.log(cardId);
    // setModalX(e.clientX);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCard = (trayId, cardId) => {
    deleteCardHook({
      variables: {
        trayId: trayId,
        cardId: cardId
      }
    });
    handleClose();
  };

  return (
    <div>
      <IconButton aria-label="settings" onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={styles.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 100
        }}
      >
        <Fade in={open}>
          <div className={styles.paper}>
            <h2 id="transition-modal-title">Card Options</h2>
            <div onClick={() => deleteCard(trayId, cardId)}>Delete</div>
            <div>Export to JIRA</div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
