import React, { useState } from "react";

export default function PollSelection({ user_info }) {
  const [register, setRegister] = useState("");
  const [select, setSelect] = useState("");
  return (
    <div>
      Register a new Poll or select a existing one:
      <br />
      <br />
      <form
        onSubmit={e => {
          e.preventDefault();
          console.log("register");
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
}
