import React from "react";
import styles from "./BoardHeader.module.scss";

const BoardHeader = () => {
  return (
    <div className={styles.root}>
      <h1>Jtray Board Men</h1>
      <button>Count favorite</button>
    </div>
  );
};

export default BoardHeader;
