import React from "react";
import styles from "./BoardHeader.module.scss";
import { COUNT_CARDS_FAVORITE } from "../graphql/queries.graphql";
import { useLazyQuery } from "@apollo/react-hooks";

const BoardHeader = () => {
  return (
    <div className={styles.root}>
      <h1>Jtray Board Men</h1>
    </div>
  );
};

export default BoardHeader;
