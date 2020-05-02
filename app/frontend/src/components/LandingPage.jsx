import React, { useState } from "react";
import styles from "./LandingPage.module.scss";
import Auth from "./Auth.jsx";

export default () => {
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);

  const closeModal = () => {
    setRegister(false);
    setLogin(false);
  };

  const loginControl = action => {
    if (!login && action == "login") {
      setRegister(false);
      setLogin(true);
    } else if (!register && action == "register") {
      setRegister(true);
      setLogin(false);
    } else closeModal();
  };

  return (
    <div>
      <header className={styles.header}>
        <h3>Jtray</h3>
        <span onClick={() => loginControl("register")}>Register</span>
        <span onClick={() => loginControl("login")}>Login</span>
      </header>
      {login ? (
        <Auth action={"Login"} show={login} closeCallback={closeModal} />
      ) : (
        ""
      )}
      {register ? (
        <Auth action={"Register"} show={register} closeCallback={closeModal} />
      ) : (
        ""
      )}
    </div>
  );
};
