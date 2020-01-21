import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";

const CardContainer = styled.div`
  margin-bottom: 8px;
`;

export const JtrayCard = ({ text }) => (
  <div>
    <CardContainer>
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {text}
          </Typography>
        </CardContent>
      </Card>
    </CardContainer>
  </div>
);
