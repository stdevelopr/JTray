import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import styles from "./CardModal.module.scss";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_CARD, CREATE_JIRA_ISSUE } from "../graphql/mutations.graphql";

export default function SimpleModal({
  trayId,
  trayTitle,
  cardId,
  cardText,
  jiraInfo
}) {
  const [open, setOpen] = useState(false);
  const [deleteCardHook, {}] = useMutation(DELETE_CARD);
  const [createJiraIssueHook, {}] = useMutation(CREATE_JIRA_ISSUE);
  // const [modalX, setModalX] = useState(0);
  const handleOpen = e => {
    setOpen(true);
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

  const jiraExport = (cardText, jiraProject) => {
    const issueType = jiraProject.issuetypes[0]["name"];
    createJiraIssueHook({
      variables: {
        cardText: cardText,
        projectKey: jiraProject.key,
        issueType: issueType,
        summary: `Jcard ${trayTitle}`,
        jiraDomain: jiraInfo.jiraDomain,
        jiraEmail: jiraInfo.jiraEmail,
        jiraToken: jiraInfo.jiraToken
      },
      onCompleted: handleClose()
    });
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
            {jiraInfo && (
              <div>
                <div>Export to JIRA</div>
                {jiraInfo.jiraProjects.map(item => (
                  <div
                    key={item.name}
                    onClick={() => jiraExport(cardText, item)}
                    className={styles.jiraItem}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
            <div
              onClick={() => deleteCard(trayId, cardId)}
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
