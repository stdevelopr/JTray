import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import Auth from "./Auth.jsx";
import EnterContainer from "./EnterContainer.jsx";
import styles from "./App.module.scss";
import { getToken } from "./auth";
import { GET_MAIN_POLL } from "../graphql/queries.graphql";

const cache = new InMemoryCache({
  // maps ids of objects to atualize the cache after mutations
  dataIdFromObject: object => {
    switch (object.__typename) {
      case "Tray":
      case "AddCard":
      case "DeleteCard":
      case "AddTray":
      case "SwapCard":
      case "SwapTray":
      case "User":
      case "Card":
        return object.id;
    }
  }
});

cache.writeData({ data: { mainPoll: null } });

// get the token from the local storage if the user has already signed in
const token = getToken();

// set the connection with the graphql server
const client = token
  ? new ApolloClient({
      cache,
      uri: "http://127.0.0.1:5000/graphql",
      resolvers: {},
      request: operation => {
        // data to be sent on every request
        operation.setContext({
          headers: { authorization: `Bearer ${token}` }
        });
      }
    })
  : {};

/**
 * Verifies if there is a token in the local storage.
 * If yes, go to the enter screen
 * else, renders the auth screen
 */
const App = () => {
  return (
    <div className={styles.app}>
      <div className={styles.board}>
        <ApolloProvider client={client}>
          {token != "undefined" && token != null ? (
            <EnterContainer token={token} />
          ) : (
            <Auth />
          )}
        </ApolloProvider>
      </div>
    </div>
  );
};

export default App;
