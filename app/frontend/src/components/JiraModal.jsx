import React, { useState } from "react";
import styles from "./JiraModal.module.scss";
import { useMutation } from "@apollo/react-hooks";
import { SET_USER_JIRA } from "../graphql/mutations.graphql";
// import { useLazyQuery } from "@apollo/react-hooks";

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

  const [setUserJiraHook, {}] = useMutation(SET_USER_JIRA);

  const saveJiraInfo = () => {
    setUserJiraHook({
      variables: {
        userId: userId,
        jiraDomain: jiraDomain,
        jiraEmail: jiraEmail,
        jiraToken: jiraToken
      },
      onCompleted: connectJira()
    });
  };

  const connectJira = () => {
    alert("connecting... under construction!");
  };

  // const [jiraInfo, { called, loading, data }] = useLazyQuery(
  //     GET_GREETING,
  //     { variables: { language: "english" } }
  // );
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
      <button onClick={() => saveJiraInfo()}>Save</button>
      <button onClick={() => connectJira()}>Connect</button>
    </div>
  );
}
