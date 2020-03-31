import React, { useState, useEffect } from "react";
import { authenticate, isAuthenticated, register } from "./auth";

/**
 *  Component to render if the user is not logged in
 */
function Auth() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  // at first supposes the user is  already regitered and renders the login component
  const [registered, setRegistered] = useState(true);

  // renders the login component, and verifies if the user is authorized
  const renderLogIn = () => {
    return (
      <div>
        <h1>Login</h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            authenticate(user, password).then(auth => {
              if (auth) {
                window.location.reload();
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
        <button
          onClick={() => {
            setRegistered(false);
            setUser("");
            setPassword("");
          }}
        >
          Register
        </button>
      </div>
    );
  };

  // renders a register component if the user is not registered yet.
  const renderRegister = () => {
    return (
      <div>
        <h1>Register</h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            register(user, password).then(res => console.log(res));
            setRegistered(true);
            setUser("");
            setPassword("");
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

  // if the user is not logged in renders the login or the register component
  const login_register = registered ? renderLogIn() : renderRegister();

  return login_register;
}

export default Auth;
