import React from "react";
import { withApollo } from "@apollo/react-hoc";
import BoardHeader from "./BoardHeader.jsx";
import Header from "./Header.jsx";
import { TrayBoard } from "./TrayBoard.jsx";

const Jtray = ({ client }) => {
  // decode the token and write the info in the cache
  client.writeData({
    data: {
      userId: "25"
    }
  });
  return (
    <div>
      <Header />
      <BoardHeader />
      <TrayBoard />
    </div>
  );
};

export default withApollo(Jtray);
