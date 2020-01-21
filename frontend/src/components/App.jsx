import React, { useContext } from "react";
import { ListBoard } from "./List.jsx";
import { ListProvider } from "../ListContext";

const App = () => {
  return (
    <div>
      <ListProvider>
        <ListBoard />
      </ListProvider>
    </div>
  );
};

export default App;
