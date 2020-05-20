import React, { useState, useEffect, useRef } from "react";
import styles from "./NavSideMenu.module.scss";
import { withApollo } from "@apollo/react-hoc";
import { GET_MAIN_POLL } from "../graphql/queries.graphql";
import JiraModal from "./JiraModal.jsx";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_POLL } from "../graphql/mutations.graphql";
import { GET_USER_POLLS, GET_PUBLIC_POLLS } from "../graphql/queries.graphql";
import SettingsIcon from "@material-ui/icons/Settings";
// import MoreVertIcon from "@material-ui/icons/MoreVert";

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
  const [openItemModalId, setOpenItemModalId] = useState(null);
  const [openJiraConfigModal, setOpenJiraConfigModal] = useState(false);

  const [deletePollHook, {}] = useMutation(DELETE_POLL);

  const handleOpen = e => {
    setOpenItemModalId(e.target.closest("button").getAttribute("pollid"));
    openItemModalId == e.target.closest("button").getAttribute("pollid")
      ? setOpenItemModalId(null)
      : null;
  };

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

  const deletePollId = (pollId, userId) => {
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
            <svg width="30" height="30">
              <path d="M0,5 30,5" stroke="#fff" strokeWidth="3" />
              <path d="M0,14 30,14" stroke="#fff" strokeWidth="3" />
              <path d="M0,23 30,23" stroke="#fff" strokeWidth="3" />
            </svg>
            <h3 className={styles.myPollsText}>Private</h3>
          </a>
        </span>
        <div className={styles.logo}>
          <h1 className={styles.title}>{pollTitle}</h1>
          <div>{annotations}</div>
        </div>
        <div className={styles.jiraIcon}>
          Jira
          <IconButton
            ref={modalOpenButton}
            aria-label="settings"
            onClick={() => setOpenJiraConfigModal(!openJiraConfigModal)}
          >
            <SettingsIcon />
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
                    onClick={handleOpen}
                    className={styles.verticalIcon}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </div>
                {openItemModalId == poll.id ? (
                  <div className={styles.itemPollDelete}>
                    <div>Delete {poll.title}</div>
                    <button onClick={() => deletePollId(poll.id, userId)}>
                      Yes
                    </button>
                    <button onClick={() => setOpenItemModalId(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  ""
                )}
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
    </div>
  );
};

export default withApollo(NavSideMenu);
