import React, { useState, useEffect, useRef } from "react";
import { authenticate, isAuthenticated, register } from "./auth";
import styles from "./Auth.module.scss";

/**
 *  Component to render if the user does not have the JWT token in the local storage.
 */
function Auth({ action, show, closeCallback }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  // at first supposes the user is  already regitered and renders the login component
  const [registered, setRegistered] = useState(false);

  const node = useRef();

  const userPass = () => (
    <div>
      <div>
        <input
          value={user}
          placeholder={"User"}
          onChange={e => setUser(e.target.value)}
        />
      </div>
      <div>
        <input
          value={password}
          type={"password"}
          placeholder={"Password"}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
    </div>
  );

  // renders the login component, and verifies if the user is authorized
  const renderLogIn = () => {
    return (
      <div>
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
          {userPass()}

          <button className={styles.loginButton} type="submit">
            Login
          </button>
        </form>
      </div>
    );
  };

  // renders a register component if the user is not registered yet.
  const renderRegister = () => {
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            register(user, password).then(res => console.log(res));
            setRegistered(true);
            setUser("");
            setPassword("");
          }}
        >
          {userPass()}
          {/* <div>
            <input
              value={password}
              placeholder={"Confirm Password"}
              onChange={e => setPassword(e.target.value)}
            />
          </div> */}
          <button className={styles.registerButton} type="submit">
            Register
          </button>
        </form>
      </div>
    );
  };

  // if the user is not logged in renders the login or the register component
  const login_register =
    action == "Login" || registered ? renderLogIn() : renderRegister();

  return (
    <div
      style={{ display: show ? "block" : "none" }}
      ref={node}
      className={styles.modalPanel}
      onClick={e => {
        if (node.current == e.target) closeCallback();
      }}
    >
      <div className={styles.window}>
        {action}
        {login_register}
      </div>
    </div>
  );
}

export default Auth;
