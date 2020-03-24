import React from "react";
import jwt_decode from "jwt-decode";
import { withApollo } from "@apollo/react-hoc";
import PollSelection from "./PollSelection.jsx";
import Jtray from "./Jtray.jsx";

const EnterScreen = ({ client, token }) => {
  const user_info = jwt_decode(token);
  const mainPoll = user_info.mainPoll;
  console.log("user_info", user_info);
  // write the client data into cache to be used in the TrayBoard
  client.writeData({
    data: {
      userId: user_info.userId,
      admin: user_info.admin,
      mainPoll: ""
    }
  });

  const firstScreen = mainPoll ? (
    <Jtray />
  ) : (
    <PollSelection user_info={user_info} />
  );
  return firstScreen;
};

export default withApollo(EnterScreen);
