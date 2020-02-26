import React, { useState, useEffect } from "react";
import { authenticate, isAuthenticated } from "./auth";
import Jtray from "./Jtray.jsx";
import { withApollo } from "@apollo/react-hoc";

function Login({ client }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setlogged] = useState(false);
  useEffect(() => {
    isAuthenticated().then(auth => {
      setlogged(auth);
      //   if (auth) {
      //     console.log("[ooooooooooooooooooooooooooooo");
      //     client.writeData({
      //         data: {
      //             userId: "null"
      //           }
      //     });
      //   }
    });
  }, []);

  return logged ? (
    <Jtray />
  ) : (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          authenticate(user, password).then(auth => {
            if (auth) {
              setlogged(true);
            }
          });
        }}
      >
        <input
          value={user}
          placeholder={"user"}
          onChange={e => setUser(e.target.value)}
        />
        <input
          value={password}
          placeholder={"password"}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

export default withApollo(Login);
