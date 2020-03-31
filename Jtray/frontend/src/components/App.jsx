import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import Auth from "./Auth.jsx";
import EnterScreen from "./EnterScreen.jsx";
import styles from "./App.module.scss";
import { getToken } from "./auth";

const cache = new InMemoryCache({
  // map objects with the same id to atualize the cache after mutations
  dataIdFromObject: object => {
    switch (object.__typename) {
      case "Tray":
      case "AddCard":
      case "AddTray":
      case "SwapCard":
      case "SwapTray":
      case "Card":
        return object.id;
    }
  }
});

// set the connection with the graphql server
const client = new ApolloClient({
  cache,
  uri: "http://127.0.0.1:5000/graphql",
  resolvers: {},
  request: operation => {
    // get the token from the local storage if the user has already signed in
    const token = getToken();
    // data to be sent on every request
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ""
      }
    });
  }
});

/**
 * Verifies if there is a token in the localStorage.
 * If yes, go to the enter screen
 * else, renders the auth screen
 */
const App = () => {
  const token = getToken();
  return (
    <div className={styles.app}>
      <div className={styles.board}>
        <ApolloProvider client={client}>
          <Router>
            <Route exact path="/">
              {token != "undefined" && token != null ? (
                <EnterScreen token={token} />
              ) : (
                <Auth />
              )}
            </Route>
          </Router>
        </ApolloProvider>
      </div>
    </div>
  );
};

export default App;
