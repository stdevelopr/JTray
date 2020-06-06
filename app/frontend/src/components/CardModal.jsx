import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Backdrop from "@material-ui/core/Backdrop";
import { Card } from "@material-ui/core";
import TextareaAutosize from "react-textarea-autosize";
import Fade from "@material-ui/core/Fade";
import styles from "./CardModal.module.scss";
import { useMutation } from "@apollo/react-hooks";
import FormLabel from "@material-ui/core/FormLabel";
import {
  DELETE_CARD,
  CREATE_JIRA_ISSUE,
  UPDATE_CARD
} from "../graphql/mutations.graphql";

export default function SimpleModal({
  trayId,
  trayTitle,
  cardId,
  cardText,
  jiraInfo
}) {
  const [open, setOpen] = useState(false);
  const [textEdit, setTextEdit] = useState(cardText);
  const [deleteCardHook, {}] = useMutation(DELETE_CARD);
  const [updateCardHook, {}] = useMutation(UPDATE_CARD);
  const [createJiraIssueHook, {}] = useMutation(CREATE_JIRA_ISSUE);

  useEffect(() => {}, [textEdit]);

  const handleEdit = () => {
    updateCardHook({
      variables: {
        trayId: trayId,
        cardId: cardId,
        text: textEdit
      }
    });
    handleClose();
  };

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
            <FormLabel component="legend" style={{ margin: "10px" }}>
              Card Text
            </FormLabel>
            <div className={styles.editWrapper}>
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
                  spellCheck="false"
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
            <div className={styles.editWrapper}>
              <button className={styles.editButton} onClick={handleEdit}>
                Save
              </button>
            </div>
            <hr className={styles.horizontalLine} />
            <h2 id="transition-modal-title" style={{ textAlign: "center" }}>
              Export to JIRA
            </h2>
            <span>Click on the project to export:</span>
            {jiraInfo && (
              <div>
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
            <hr className={styles.horizontalLine} />
            <h2 id="transition-modal-title" style={{ textAlign: "center" }}>
              Delete Card
            </h2>
            <div className={styles.deleteWrapper}>
              <button
                onClick={() => deleteCard(trayId, cardId)}
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
