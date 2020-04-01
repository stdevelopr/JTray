import React from "react";
import { getToken } from "./auth";
import jwt_decode from "jwt-decode";
import { withApollo } from "@apollo/react-hoc";
import { useQuery } from "@apollo/react-hooks";
import PollSelection from "./PollSelection.jsx";
import Jtray from "./Jtray.jsx";
import { GET_JTRAY_USER } from "../graphql/queries.graphql";

/**
 * Component to render if the user has sucessfuly authenticated.
 * If the user has already a poll, loads it.
 * else create/select one.
 */
const EnterScreen = ({ client, token }) => {
  // get the user info from the token
  const user_info = jwt_decode(token);

  // verifies if the user has already been registered in Jtray and if not, creates a new user entry in the Users collection.
  const { data, loading } = useQuery(GET_JTRAY_USER, {
    variables: { userId: user_info.userId }
  });
  if (loading) return "LOADING....";
  console.log("token_info", user_info);
  console.log("user data:", data);
  const mainPoll = data.getUser.polls;
  console.log(data.getUser.polls);

  const firstScreen =
    data.getUser.polls.length != 0 ? (
      <Jtray userInfo={user_info} poll={data.getUser.polls} />
    ) : (
      <PollSelection user_info={user_info} />
    );
  return firstScreen;
};

export default withApollo(EnterScreen);
