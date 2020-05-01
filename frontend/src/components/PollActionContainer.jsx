import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { withApollo } from "@apollo/react-hoc";
import { GET_PUBLIC_POLLS } from "../graphql/queries.graphql";

import PollSelection from "./PollSelection.jsx";
import PollCreation from "./PollCreation.jsx";

const PollActionContainer = ({ userInfo, select, create, callBack }) => {
  const { data: polls, loading } = useQuery(GET_PUBLIC_POLLS, {
    variables: { userId: userInfo.id }
  });

  if (loading) return "LOADING...";

  return (
    <div>
      {create ? (
        <PollCreation
          userId={userInfo.id}
          closeCallBack={callBack ? callBack : () => {}}
        />
      ) : (
        ""
      )}
      {select ? (
        <PollSelection
          publicPolls={polls.publicPolls}
          closeCallback={callBack ? callBack : () => {}}
        ></PollSelection>
      ) : (
        ""
      )}
    </div>
  );
};

export default PollActionContainer;
