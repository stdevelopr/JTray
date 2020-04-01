import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { withApollo } from "@apollo/react-hoc";
import { GET_POLLS } from "../graphql/queries.graphql";
import { ADD_POLL, ADD_TRAY } from "../graphql/mutations.graphql";
import Jtray from "./Jtray.jsx";

const PollSelection = ({ client, user_info }) => {
  const [register, setRegister] = useState("");
  const [select, setSelect] = useState("");
  const [mainPoll, setMainPoll] = useState(null);
  const [addPollHook, {}] = useMutation(ADD_POLL);
  const { data: polls, loading } = useQuery(GET_POLLS, {
    variables: { userId: user_info.userId }
  });

  const selectPoll = e => {
    console.log(e.target.value);
    // TODO
    // get the trays for the selected poll

    setSelect(e.target.value);

    // TODO
    //put the poll info in the mainPoll state
  };

  // add a new tray and update the cache through a custom function
  const addPoll = () => {
    addPollHook({
      variables: { title: register, createdByUserId: user_info.userId }
    });
  };

  const render_select = () => {
    return (
      <div>
        Register a new Poll or select a existing one:
        <br />
        <br />
        <form
          onSubmit={e => {
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
        Select an existing poll:
        <select onChange={e => selectPoll(e)} value={select}>
          <option value="">select</option>
          {loading ? (
            <option value="">Loading...</option>
          ) : (
            polls.allPolls.map(poll => (
              <option value={poll.title}>{poll.title}</option>
            ))
          )}
        </select>
      </div>
    );
  };
  return select != "" ? (
    // TODO: put mainPoll as info to poll
    <Jtray userInfo={user_info} poll={{ title: select }} />
  ) : (
    render_select()
  );
};

export default withApollo(PollSelection);
