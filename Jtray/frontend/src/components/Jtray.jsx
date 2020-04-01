import React from "react";
import { withApollo } from "@apollo/react-hoc";
import BoardHeader from "./BoardHeader.jsx";
import Header from "./Header.jsx";
import { TrayBoard } from "./TrayBoard.jsx";
import { getToken } from "./auth";
import jwt_decode from "jwt-decode";

const Jtray = ({ client, userInfo, poll }) => {
  // decode the token and write the info into the cache
  const token = getToken();
  const decoded = jwt_decode(token);
  client.writeData({
    data: {
      userId: decoded.userId,
      admin: decoded.admin
    }
  });
  return (
    <div>
      <Header />
      <h1>{poll.title} Poll</h1>
      {/* <BoardHeader /> */}
      <TrayBoard />
    </div>
  );
};

export default withApollo(Jtray);
