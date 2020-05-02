import React from "react";
import jwt_decode from "jwt-decode";
import { useQuery } from "@apollo/react-hooks";
import PollActionContainer from "./PollActionContainer.jsx";
import Jtray from "./Jtray.jsx";
import {
  GET_USER_POLLS,
  GET_PUBLIC_POLLS,
  GET_MAIN_POLL
} from "../graphql/queries.graphql";

// TODO: DRAG LIST AND DROP AT SAME POSITION ERROR....

const Enter = ({ userInfo, mainPoll, polls }) => {
  const firstScreen = mainPoll ? (
    <Jtray
      userInfo={userInfo}
      selectedPollId={mainPoll.id}
      selectedPollTitle={mainPoll.title}
      selectedPollCreatedByUserId={mainPoll.createdByUserId}
      publicPolls={polls.publicPolls}
      mainPoll={mainPoll}
    />
  ) : (
    <div
      style={{
        backgroundColor: "darkturquoise",
        height: "100vh",
        textAlign: "center"
      }}
    >
      <h2 style={{ color: "white" }}>You have no polls yet... </h2>
      <h2 style={{ color: "white" }}>Create or select one.</h2>
      <PollActionContainer userInfo={userInfo} select create />
    </div>
  );
  return firstScreen;
};

/**
 * Component to render if the user has sucessfuly authenticated.
 * If the user already has a poll, loads it.
 * else create/select one.
 */

const EnterContainer = ({ token }) => {
  // get the user info from the token
  const _userInfo = jwt_decode(token);

  // get the user information from
  const { data: userData, loading: loadingUser } = useQuery(GET_USER_POLLS, {
    variables: { userId: _userInfo.id }
  });

  // gets all polls
  const { data: polls, loading: loadingPolls } = useQuery(GET_PUBLIC_POLLS, {});

  const { data: main } = useQuery(GET_MAIN_POLL, {});

  if (loadingUser || loadingPolls) return "LOADING....";

  const userInfo = userData.getUser;

  // if the user has a poll set it as the main poll, else use the cache data
  const mainPoll = main.mainPoll
    ? main.mainPoll
    : userInfo.polls.length != 0
    ? userInfo.polls[0]
    : null;

  return <Enter userInfo={userInfo} polls={polls} mainPoll={mainPoll} />;
};

export default EnterContainer;
