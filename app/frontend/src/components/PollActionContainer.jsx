import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { withApollo } from "@apollo/react-hoc";
import { GET_PUBLIC_POLLS } from "../graphql/queries.graphql";

import PollSelection from "./PollSelection.jsx";
import PollCreation from "./PollCreation.jsx";

const PollActionContainer = ({ userInfo, select, create, callBack }) => {
  return (
    <div>
      {create && (
        <PollCreation
          userId={userInfo.id}
          closeCallBack={callBack ? callBack : () => {}}
        />
      )}
      {select && (
        <PollSelection
          userId={userInfo.id}
          closeCallback={callBack ? callBack : () => {}}
        ></PollSelection>
      )}
    </div>
  );
};

export default PollActionContainer;
