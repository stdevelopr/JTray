import React, { useState, useEffect, useRef } from "react";
import styles from "./NavSideMenu.module.scss";
import { withApollo } from "@apollo/react-hoc";
import { GET_MAIN_POLL } from "../graphql/queries.graphql";
import JiraModal from "./JiraModal.jsx";
import PollModal from "./PollModal.jsx";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_POLL } from "../graphql/mutations.graphql";
import { GET_USER_POLLS, GET_PUBLIC_POLLS } from "../graphql/queries.graphql";
import SettingsIcon from "@material-ui/icons/Settings";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PersonIcon from "@material-ui/icons/Person";

const NavSideMenu = ({
  polls,
  children,
  selectedPollId,
  pollTitle,
  annotations,
  userPolls,
  jiraInfo,
  userId,
  client
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openPollModal, setOpenPollModal] = useState(false);
  const [modalPollId, setModalPollId] = useState("");
  const [modalPollTitle, setModalPollTitle] = useState("");
  const [modalPollDescription, setModalPollDescription] = useState("");
  const [modalPollVisibility, setModalPollVisibility] = useState("");
  const [openItemModalId, setOpenItemModalId] = useState(null);
  const [openJiraConfigModal, setOpenJiraConfigModal] = useState(false);

  const setMainPoll = (
    pollId,
    pollTitle,
    pollAnnotations,
    pollCreatedByUserId
  ) => {
    const mainPoll = {
      id: pollId,
      title: pollTitle,
      annotations: pollAnnotations,
      createdByUserId: pollCreatedByUserId,
      __typename: "mainPoll"
    };

    client.writeQuery({
      query: GET_MAIN_POLL,
      data: { mainPoll: mainPoll }
    });
  };

  const modalOpenButton = useRef();

  useEffect(() => {}, []);

  return (
    <div>
      <nav className={styles.navbar}>
        <span>
          <a
            href="#"
            onClick={() => {
              setOpenDrawer(!openDrawer);
              setOpenItemModalId(null);
            }}
          >
            <PersonIcon style={{ color: "white" }} />
            <div className={styles.myPollsText}>My Polls</div>
          </a>
        </span>
        <div className={styles.logo}>
          <div style={{ textAlign: "center" }}>
            <span className={styles.title}>{pollTitle}</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <span className={styles.annotations}>{annotations}</span>
          </div>
        </div>
        <div className={styles.jiraIcon}>
          Jira
          <IconButton
            ref={modalOpenButton}
            aria-label="settings"
            onClick={() => setOpenJiraConfigModal(!openJiraConfigModal)}
          >
            <SettingsIcon style={{ color: "white" }} />
          </IconButton>
        </div>
      </nav>
      <div className={styles.parentHeight}>
        <div
          className={`${styles.sidenav} ${
            openDrawer ? styles.side_open : styles.side_close
          }`}
        >
          <a
            href="#"
            onClick={() => {
              setOpenDrawer(false);
              setOpenItemModalId(null);
            }}
          >
            &times;
          </a>
          {userPolls.map(poll => {
            let admin_style = userId == poll.createdByUserId;
            return (
              <div
                href="#"
                key={poll.id}
                pollcreatedbyuserid={poll.createdByUserId}
                className={`${styles.sideMenuItem}  ${
                  selectedPollId == poll.id ? styles.selected : ""
                }`}
              >
                <div
                  pollid={poll.id}
                  annotations={poll.annotations}
                  id="nav-item"
                  onClick={() =>
                    setMainPoll(
                      poll.id,
                      poll.title,
                      poll.annotations,
                      poll.createdByUserId
                    )
                  }
                >
                  {poll.title}
                </div>
                <div className={styles.verticalIconContainer}>
                  <IconButton
                    aria-label="settings"
                    pollid={poll.id}
                    onClick={() => {
                      setModalPollId(poll.id);
                      setModalPollTitle(poll.title);
                      setModalPollDescription(poll.annotations);
                      setModalPollVisibility(poll.visibility);
                      setOpenPollModal(true);
                    }}
                    className={styles.verticalIcon}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </div>
        {openJiraConfigModal && (
          <JiraModal
            jiraInfo={jiraInfo}
            userId={userId}
            setOpenCallBack={setOpenJiraConfigModal}
            refButton={modalOpenButton}
          />
        )}
        <div
          className={`${styles.content} ${
            openDrawer ? styles.content_open : styles.content_close
          }`}
        >
          {children}
        </div>
      </div>
      {openPollModal && (
        <PollModal
          open={openPollModal}
          setOpen={setOpenPollModal}
          pollId={modalPollId}
          pollTitle={modalPollTitle}
          pollDescription={modalPollDescription}
          pollVisibility={modalPollVisibility}
          userId={userId}
        />
      )}
    </div>
  );
};

export default withApollo(NavSideMenu);
