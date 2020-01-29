import React, { useContext } from "react";
import { ListBoard } from "./ListBoard.jsx";
import { ListProvider } from "../ListContext";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const client = new ApolloClient({
  uri: "http://127.0.0.1:5000/graphql",
  resolvers: {}
});

const App = () => {
  return (
    <div>
      <ApolloProvider client={client}>
        <ListProvider>
          <ListBoard />
        </ListProvider>
      </ApolloProvider>
    </div>
  );
};

export default App;
