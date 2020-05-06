import React from "react";
import styles from "./BoardHeader.module.scss";

const BoardHeader = ({ pollTitle }) => {
  return (
    <div className={styles.root}>
      <h1>{pollTitle}</h1>
    </div>
  );
};

export default BoardHeader;
