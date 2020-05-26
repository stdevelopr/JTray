import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import EnterContainer from "./EnterContainer.jsx";
import { HOST_ADDRESS, getToken } from "./auth";

const cache = new InMemoryCache({
  // maps ids of objects to atualize the cache after mutations
  dataIdFromObject: object => {
    switch (object.__typename) {
      case "Tray":
      case "AddCard":
      case "DeleteCard":
      case "UpdateCard":
      case "AddTray":
      case "UpdateTray":
      case "SwapCard":
      case "SwapTray":
      case "User":
      case "Card":
        return object.id;
    }
  }
});

cache.writeData({ data: { mainPoll: null } });

const token = getToken();

// set the connection with the graphql server
const client = new ApolloClient({
  cache,
  uri: "/graphql",
  resolvers: {},
  request: operation => {
    // data to be sent on every request
    operation.setContext({
      headers: { authorization: `Bearer ${token}` }
    });
  }
});

export default ({ token }) => {
  return (
    <ApolloProvider client={client}>
      <EnterContainer token={token}></EnterContainer>
    </ApolloProvider>
  );
};
