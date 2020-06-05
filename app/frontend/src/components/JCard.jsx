import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import { useMutation } from "@apollo/react-hooks";
import StarRateIcon from "@material-ui/icons/StarRate";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextareaAutosize from "react-textarea-autosize";
import CardModal from "./CardModal.jsx";
import styles from "./JCard.module.scss";
import { SET_CARD_FAVORITE } from "../graphql/mutations.graphql";

export const JCard = ({
  text,
  snapshot,
  trayId,
  trayTitle,
  cardId,
  favoritedBy,
  userId,
  admin,
  jiraInfo,
  visibility
}) => {
  const [open, setOpen] = React.useState(false);
  const [favorite, setFavorite] = React.useState(favoritedBy.includes(userId));
  const [setCardFavorite, { error: setFavoriteError }] = useMutation(
    SET_CARD_FAVORITE
  );

  const setFav = () => {
    const favoriteStatus = !favorite;
    setCardFavorite({
      variables: { trayId, cardId, userId, favoriteStatus },
      update: () => setFavorite(!favorite)
    });
  };
  const countFavorite = favoritedBy.length;
  return (
    <div>
      <Card className={snapshot.isDragging ? styles.move : styles.static}>
        <CardHeader
          style={{ paddingBottom: "0px" }}
          avatar={
            visibility == "public" && (
              <Avatar>{admin ? countFavorite : "R"}</Avatar>
            )
          }
          action={
            admin ? (
              <CardModal
                trayId={trayId}
                trayTitle={trayTitle}
                cardId={cardId}
                cardText={text}
                jiraInfo={jiraInfo}
              />
            ) : (
              <div
                className={favorite ? styles.starfavorite : styles.star}
                onClick={e => {
                  setFav();
                }}
              ></div>
            )
          }
        />

        <TextareaAutosize
          value={text}
          style={{
            resize: "none",
            overflow: "hidden",
            minWidth: "272px",
            outline: "none",
            border: "none",
            margin: "10px",
            caretColor: "transparent"
          }}
        />
      </Card>
    </div>
  );
};
