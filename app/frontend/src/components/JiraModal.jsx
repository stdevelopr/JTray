import React, { useState, useEffect } from "react";
import styles from "./JiraModal.module.scss";
import { useMutation } from "@apollo/react-hooks";
import {
  SAVE_USER_JIRA_INFO,
  SAVE_USER_JIRA_PROJECTS
} from "../graphql/mutations.graphql";
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_JIRA_PROJECTS } from "../graphql/queries.graphql";
import { style } from "@material-ui/system";

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

  const [setUserJiraHook, {}] = useMutation(SAVE_USER_JIRA_INFO);

  const [getJiraProjects, { called, loading, data }] = useLazyQuery(
    GET_JIRA_PROJECTS,
    { variables: { userId: userId } }
  );

  const [saveJiraProjects, {}] = useMutation(SAVE_USER_JIRA_PROJECTS);

  useEffect(() => {
    // everytime we have data from getting the projects save it to the user table
    if (data) {
      const list = data.jiraProjects.map(item => ({
        name: item.name,
        key: item.key,
        id: item.id
      }));
      saveJiraProjects({
        variables: {
          userId: userId,
          jiraProjects: list
        }
      });
    }
  }, [data]);

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
    getJiraProjects();
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
      <button onClick={() => saveJiraInfo()}>Save</button>
      <button onClick={() => connectJira()}>Connect</button>
      {data
        ? data.jiraProjects.map(item => (
            <div key={item.name} className={styles.jiraProjectItem}>
              {item.name}
            </div>
          ))
        : ""}
    </div>
  );
}
