import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ADD_POLL, ADD_TRAY } from "../graphql/mutations.graphql";
import {
  GET_USER_POLLS,
  GET_PUBLIC_POLLS,
  GET_MAIN_POLL
} from "../graphql/queries.graphql";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { withApollo } from "@apollo/react-hoc";
import Button from "@material-ui/core/Button";

function PollCreation({ userId, closeCallBack, animationClass, client }) {
  const [pollTitle, setPollTitle] = useState("");
  const [addPollHook, {}] = useMutation(ADD_POLL);
  const [pollVisibility, setPollVisibility] = useState("public");
  const [pollAnnotations, setPollAnnotations] = useState("");

  const handleChange = event => {
    setPollVisibility(event.target.value);
  };

  const setMainPoll = () => {
    closeCallBack();
    client.writeQuery({
      query: GET_MAIN_POLL,
      data: { mainPoll: null }
    });
  };

  // add a new tray and update the cache through a custom function
  const addPoll = () => {
    addPollHook({
      variables: {
        title: pollTitle,
        createdByUserId: userId,
        visibility: pollVisibility,
        annotations: pollAnnotations
      },
      onCompleted: setMainPoll(),
      refetchQueries: [
        { query: GET_USER_POLLS, variables: { userId: userId } },
        { query: GET_PUBLIC_POLLS }
      ]
    });
  };
  //
  return (
    <div
      className={animationClass}
      style={{
        display: "grid",
        gridTemplateColumns: "50% 50%",
        backgroundColor: "aliceblue",
        border: "solid",
        padding: "5em",
        paddingTop: "30px",
        width: "1000px",
        margin: "auto"
      }}
    >
      {/* <h1>POLL CREATION</h1> */}
      <div style={{ display: "grid" }}>
        <div>
          <TextField
            // style={{ verticalAlign: "baseline" }}
            id="standard-password-inp"
            label="Poll Name"
            value={pollTitle}
            onChange={e => setPollTitle(e.target.value)}
            // type="password"
            // autoComplete="current-password"
          />
        </div>
        <TextareaAutosize
          style={{ margin: "50px" }}
          aria-label="minimum height"
          rowsMin={3}
          onChange={e => setPollAnnotations(e.target.value)}
          value={pollAnnotations}
          placeholder="Annotations"
        />
      </div>
      <div>
        <FormControl component="fieldset">
          <FormLabel component="legend">Visibility</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={pollVisibility}
            onChange={handleChange}
          >
            <FormControlLabel
              value="public"
              control={<Radio />}
              label="Public"
            />
            {/* <div>
              <FormControlLabel
                value="password"
                control={<Radio />}
                label="Public with password"
              />
              <TextField
                // style={{ verticalAlign: "baseline" }}
                id="standard-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
              />
            </div> */}
            <FormControlLabel
              value="private"
              control={<Radio />}
              label="Private"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <Button variant="contained" color="primary" onClick={addPoll}>
        CREATE
      </Button>
    </div>
  );
}

export default withApollo(PollCreation);
