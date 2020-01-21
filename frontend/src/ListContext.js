import React, { useState, createContext } from "react";
import { getThemeProps } from "@material-ui/styles";

export const ListContext = createContext();

export const ListProvider = props => {
  const [lists, setList] = useState([
    {
      title: "Background",
      id: `list-${0}`,
      cards: [
        {
          id: 0,
          text: "a"
        },
        {
          id: 1,
          text: "b"
        }
      ]
    },
    {
      title: "Selected",
      id: `list-${1}`,
      cards: [
        {
          id: 2,
          text: "c"
        },
        {
          id: 3,
          text: "d"
        },
        {
          id: 4,
          text: "e"
        },
        {
          id: 5,
          text: "f"
        }
      ]
    },
    {
      title: "Develop",
      id: `list-${2}`,
      cards: [
        {
          id: 6,
          text: "g"
        },
        {
          id: 7,
          text: "h"
        }
      ]
    }
  ]);
  return (
    <ListContext.Provider value={[lists, setList]}>
      {props.children}
    </ListContext.Provider>
  );
};
