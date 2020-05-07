import React, { useState, useEffect } from "react";
import styles from "./JiraModal.module.scss";
import { useMutation } from "@apollo/react-hooks";
import { SAVE_USER_JIRA_INFO } from "../graphql/mutations.graphql";
import { GET_USER_POLLS } from "../graphql/queries.graphql";

export default function JiraModal({ jiraInfo, userId }) {
  const [jiraDomain, setJiraDomain] = useState(
    jiraInfo ? jiraInfo.jiraDomain : ""
  );
  const [jiraEmail, setJiraEmail] = useState(
    jiraInfo ? jiraInfo.jiraEmail : ""
  );
  const [jiraToken, setJiraToken] = useState(
    jiraInfo ? jiraInfo.jiraToken : ""
  );

  const [
    saveJiraInfoHook,
    { loading: infoMutationLoading, error: infoMutationError }
  ] = useMutation(SAVE_USER_JIRA_INFO);

  const saveJiraInfo = () => {
    saveJiraInfoHook({
      variables: {
        userId: userId,
        jiraDomain: jiraDomain,
        jiraEmail: jiraEmail,
        jiraToken: jiraToken
      },
      refetchQueries: [{ query: GET_USER_POLLS, variables: { userId: userId } }]
    });
  };

  return (
    <div className={styles.jiraModal}>
      <input
        placeholder="jira domain"
        value={jiraDomain}
        onChange={e => setJiraDomain(e.target.value)}
      ></input>
      <input
        placeholder="jira email"
        value={jiraEmail}
        onChange={e => setJiraEmail(e.target.value)}
      ></input>
      <input
        placeholder="jira token"
        value={jiraToken}
        onChange={e => setJiraToken(e.target.value)}
      ></input>
      <button onClick={() => saveJiraInfo()}>Connect/Atualize</button>
      {infoMutationLoading && (
        <div className={styles.jiraProjectLoading}>Loading...</div>
      )}
      {infoMutationError && (
        <div className={styles.jiraProjectLoading}>Error</div>
      )}
      {jiraInfo.jiraProjects && (
        <div className={styles.jiraProjectsHeader}>Jira Projects</div>
      )}
      {jiraInfo.jiraProjects
        ? jiraInfo.jiraProjects.map(item => (
            <div key={item.name} className={styles.jiraProjectItem}>
              {item.name}
            </div>
          ))
        : ""}
    </div>
  );
}
