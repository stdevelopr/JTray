import React, { useState } from "react";
import PollActionContainer from "./PollActionContainer.jsx";
import styles from "./HeaderPublicSelect.module.scss";
import { logOut } from "./auth";
import PublicIcon from "@material-ui/icons/Public";
import AddIcon from "@material-ui/icons/Add";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PeopleAltSharpIcon from "@material-ui/icons/PeopleAltSharp";
import Icon from "@material-ui/core/Icon";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
// import PollActionContainer from "./PollActionContainer.jsx";
import PollSelection from "./PollSelection.jsx";
import PollCreation from "./PollCreation.jsx";

export default function HeaderPublicSelect({ userInfo }) {
  const [openSelectModal, setOpenSelectModal] = useState(false);
  const [openCreationModal, setOpenCreationModal] = useState(false);

  return (
    <div>
      <nav className={styles.navbar}>
        <span>
          <a href="#" onClick={() => setOpenSelectModal(!openSelectModal)}>
            <PublicIcon style={{ color: "white" }} />

            <div className={styles.publicText}>Public Polls</div>
          </a>
        </span>
        <div
          className={
            openCreationModal ? styles.addButtonOpen : styles.addButtonClose
          }
        >
          <AddIcon
            style={{ fontSize: "40px" }}
            onClick={() => {
              setOpenCreationModal(!openCreationModal);
            }}
          />
        </div>
        <div className={styles.logo}>
          <h3>JTRAY</h3>
        </div>
        <button className={styles.logoutButton} onClick={() => logOut()}>
          Logout
        </button>
      </nav>
      {openSelectModal && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={styles.modal}
          open={openSelectModal}
          onClose={() => setOpenSelectModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 100
          }}
        >
          <Fade in={openSelectModal}>
            <div style={{ minHeight: "100%", paddingLeft: "60px" }}>
              <PollSelection
                userId={userInfo.id}
                closeCallback={() => setOpenSelectModal(false)}
              />
              <div
                onClick={() => setOpenSelectModal(false)}
                style={{
                  fontSize: "40px",
                  position: "fixed",
                  top: "10px",
                  left: "30px",
                  color: "white"
                }}
              >
                X
              </div>
            </div>
          </Fade>
        </Modal>
      )}
      {openCreationModal && (
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={styles.modalCreate}
          open={openCreationModal}
          onClose={() => setOpenCreationModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 100
          }}
        >
          <Fade in={openCreationModal}>
            <div>
              <PollCreation
                userId={userInfo.id}
                closeCallBack={() => setOpenCreationModal(false)}
              />
            </div>
          </Fade>
        </Modal>
      )}
    </div>
  );
}
