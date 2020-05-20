import React, { useState, useEffect, useRef } from "react";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import styles from "./TrayModal.module.scss";
import Backdrop from "@material-ui/core/Backdrop";

export default function TrayModal({
  open,
  setOpen,
  deleteTrayCallBack,
  trayId
}) {
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
            <h2 id="transition-modal-title">Delete tray and all its cards?</h2>

            <div
              onClick={() => {
                deleteTrayCallBack(trayId);
                setOpen(false);
              }}
              className={styles.deleteItem}
            >
              Delete
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
