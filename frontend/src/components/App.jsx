import React from "react";
import { ListBoard } from "./ListBoard.jsx";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import Header from "./Header.jsx"
import BoardHeader from "./BoardHeader.jsx"
import styles from "./App.module.scss"

const cache = new InMemoryCache({
  // map objects wit same id after mutations to atualize the cache
  dataIdFromObject: object => {
    switch (object.__typename) {
      case "Tray":
      case "AddCard":
      case "AddTray":
      case "SwapCard":
      case "SwapTray":
        return object.id;
    }
  }
});

const client = new ApolloClient({
  cache,
  uri: "http://127.0.0.1:5000/graphql",
  resolvers: {}
});

const App = () => {
  return (
    <div className={styles.app}>
    <div className={styles.board}>
      <ApolloProvider client={client}>
        <Header />
        <BoardHeader />
        <ListBoard />
      </ApolloProvider>
    </div>
    </div>
  );
};

export default App;
