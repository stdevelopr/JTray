import React, { useState, useEffect, useRef } from "react";
import { authenticate, isAuthenticated, register } from "./auth";
import styles from "./Auth.module.scss";

/**
 *  Component to render if the user does not have the JWT token in the local storage.
 */
function Auth({ action, show, closeCallback }) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [registerMsg, setRegisterMsg] = useState("");
  const [registered, setRegistered] = useState(false);
  const [title, setTitle] = useState(action);

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
            authenticate(user, password)
              .then(res => {
                setRegisterMsg(res);
                setRegistered(true);
                window.location.reload();
              })
              .catch(err => {
                setRegisterMsg(err.response.data);
              });
          }}
        >
          {userPass()}
          <div
            className={
              registered
                ? styles.successRegisterMessage
                : styles.failRegisterMessage
            }
          >
            {registerMsg}
          </div>

          <button className={styles.loginButton} type="submit">
            Login
          </button>
        </form>
      </div>
    );
  };

  // renders a register component if the user is not registered yet.
  const renderRegister = () => {
    // const registerMsg = useRef();
    return (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
            register(user, password)
              .then(res => {
                setRegisterMsg(res.data);
                setRegistered(true);
                setTitle("Login");
              })
              .catch(err => {
                setRegisterMsg(err.response.data);
              });

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
          <div
            className={
              registered
                ? styles.successRegisterMessage
                : styles.failRegisterMessage
            }
          >
            {registerMsg}
          </div>
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
        {title}
        {login_register}
      </div>
    </div>
  );
}

export default Auth;
