import React, { useState } from "react";
import PollActionContainer from "./PollActionContainer.jsx";
import styles from "./HeaderPublicSelect.module.scss";
import { logOut } from "./auth";

export default function HeaderPublicSelect({ userInfo }) {
  const [openSelectModal, setopenSelectModal] = useState(false);
  const [openCreationModal, setOpenCreationModal] = useState(false);

  return (
    <div>
      <nav className={styles.navbar}>
        <span>
          <a href="#" onClick={() => setopenSelectModal(!openSelectModal)}>
            <svg width="30" height="30">
              <path d="M0,5 30,5" stroke="#fff" strokeWidth="3" />
              <path d="M0,14 30,14" stroke="#fff" strokeWidth="3" />
              <path d="M0,23 30,23" stroke="#fff" strokeWidth="3" />
            </svg>
            <h3 className={styles.publicText}>Public</h3>
          </a>
        </span>
        <button
          className={styles.addPollButton}
          onClick={() => setOpenCreationModal(!openCreationModal)}
        >
          Add
        </button>
        <div className={styles.logo}>
          <h3>JTRAY</h3>
        </div>
        <button className={styles.logoutButton} onClick={() => logOut()}>
          Logout
        </button>
      </nav>
      {openSelectModal ? (
        <div
          className={
            openCreationModal
              ? styles.selectCreateModalContainer
              : styles.selectModalContainer
          }
        >
          <PollActionContainer
            userInfo={userInfo}
            callBack={() => setopenSelectModal(false)}
            select
          />
        </div>
      ) : (
        ""
      )}
      {openCreationModal ? (
        <div className={styles.createModalContainer}>
          <h2
            className={styles.closeButton}
            onClick={() => setOpenCreationModal(false)}
          >
            X
          </h2>
          <PollActionContainer
            userInfo={userInfo}
            callBack={() => setOpenCreationModal(false)}
            create
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
