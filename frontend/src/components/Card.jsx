import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardModal from "./CardModal.jsx";
import styles from "./Card.module.scss";

export const JtrayCard = ({ text, snapshot }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Card className={snapshot.isDragging ? styles.move : styles.static}>
        <CardHeader
          avatar={<Avatar aria-label="recipe">R</Avatar>}
          action={<CardModal />}
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {text}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
