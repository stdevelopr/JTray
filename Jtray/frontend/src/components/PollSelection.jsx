import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { withApollo } from "@apollo/react-hoc";
import { ADD_POLL, ADD_TRAY } from "../graphql/mutations.graphql";

const PollSelection = ({ client, user_info }) => {
  const [register, setRegister] = useState("");
  const [select, setSelect] = useState("");
  const [mainPoll, setMainPoll] = useState(null);
  const [addPollHook, {}] = useMutation(ADD_POLL);
  // const [addTrayHook, {}] = useMutation(ADD_TRAY);

  // add a new tray and update the cache through a custom function
  const addPoll = () => {
    addPollHook({
      variables: { title: register, createdByUserId: user_info.userId },
      onCompleted: client.writeData({
        data: {
          mainPoll: register
        }
      })
    });
  };

  const pollSelection = () => {
    return (
      <div>
        Register a new Poll or select a existing one:
        <br />
        <br />
        <form
          onSubmit={e => {
            // e.preventDefault();
            console.log("register");
            addPoll();
          }}
        >
          <input
            value={register}
            placeholder={"Register a new Poll"}
            onChange={e => setRegister(e.target.value)}
          />
          <button type="submit">submit</button>
        </form>
        <input
          value=""
          placeholder={"Select an existing poll"}
          onChange={e => setSelect(e.target.value)}
        />
      </div>
    );
  };
  return pollSelection();
};

export default withApollo(PollSelection);
