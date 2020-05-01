import React from "react";
import styles from "./PollActionContainer.module.scss";
import { withApollo } from "@apollo/react-hoc";
import { GET_MAIN_POLL } from "../graphql/queries.graphql";

const PollSelection = ({ publicPolls, closeCallback, client }) => {
  console.log("PUBLIC POLL", publicPolls);
  const selectPollAndCloseSelection = (
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
    closeCallback();
  };

  return (
    <div>
      <div className={styles.pollsParent}>
        {publicPolls.map(poll => (
          <div
            className={styles.pollContent}
            pollid={poll.id}
            key={poll.id}
            onClick={() =>
              selectPollAndCloseSelection(
                poll.id,
                poll.title,
                poll.annotations,
                poll.createdByUserId
              )
            }
          >
            <div
              className={styles.contentWrapper}
              pollid={poll.id}
              polltitle={poll.title}
            ></div>
            <div className={styles.listItemTitle}>{poll.title}</div>

            <div className={styles.listItemAnnotations}>{poll.annotations}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withApollo(PollSelection);
