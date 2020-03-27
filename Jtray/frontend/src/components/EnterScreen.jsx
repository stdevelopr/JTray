import React from "react";
import jwt_decode from "jwt-decode";
import { withApollo } from "@apollo/react-hoc";
import { useQuery } from "@apollo/react-hooks";
import PollSelection from "./PollSelection.jsx";
import Jtray from "./Jtray.jsx";
import { GET_JTRAY_USER } from "../graphql/queries.graphql";

const EnterScreen = ({ client, token }) => {
  // verify if the user is authenticated by the login microsrvice
  const user_info = jwt_decode(token);

  // verify if the user has already been registered in Jtray and create a new one, if not.
  const { data, loading } = useQuery(GET_JTRAY_USER, {
    variables: { userId: user_info.userId }
  });
  if (loading) return "LOADING....";
  console.log("daaaaaaaaaaaa", data);
  const mainPoll = data.getUser.polls;
  console.log("user_info", user_info);

  const firstScreen =
    data.getUser.polls.length != 0 ? (
      <Jtray />
    ) : (
      <PollSelection user_info={user_info} />
    );
  return firstScreen;
};

export default withApollo(EnterScreen);
