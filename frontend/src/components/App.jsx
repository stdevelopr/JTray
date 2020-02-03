import React from "react";
import { ListBoard } from "./ListBoard.jsx";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";

const cache = new InMemoryCache({
  // map objects wit same id after mutations to atualize the cache
  dataIdFromObject: object => {
    switch (object.__typename) {
      case "Tray":
      case "AddCard":
      case "AddTray":
      case "SwapCard":
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
    <div>
      <ApolloProvider client={client}>
        <ListBoard />
      </ApolloProvider>
    </div>
  );
};

export default App;
