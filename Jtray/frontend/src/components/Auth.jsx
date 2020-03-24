import React, { useState, useEffect } from "react";
import { authenticate, isAuthenticated, register } from "./auth";
import PollSelection from "./PollSelection.jsx";
import Jtray from "./Jtray.jsx";
import { withApollo } from "@apollo/react-hoc";

function Auth({ client }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [mainPoll, setMainPoll] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [registered, setRegistered] = useState(true);

  useEffect(() => {
    isAuthenticated().then(auth => {
      setAuthorized(auth);
    });
  }, []);

  const renderLogIn = () => {
    return (
      <div>
        <h1>Login</h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            authenticate(user, password).then(auth => {
              if (auth) {
                setAuthorized(true);
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
        <button onClick={() => setRegistered(false)}>Register</button>
      </div>
    );
  };

  const renderRegister = () => {
    return (
      <div>
        <h1>Register</h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            register(user, password).then(res => console.log(res));
          }}
        >
          <div>
            <input
              value={user}
              placeholder={"user"}
              onChange={e => setUser(e.target.value)}
            />
          </div>
          <div>
            <input
              value={password}
              placeholder={"password"}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    );
  };

  const first_screen = mainPoll ? <Jtray /> : <PollSelection />;
  const login_register = registered ? renderLogIn() : renderRegister();

  const auth_redir = authorized ? first_screen : login_register;

  return auth_redir;
}

export default withApollo(Auth);
