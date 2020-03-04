import express, { Application, Request, Response, NextFunction } from "express";

const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes.ts");
const mongoose = require("mongoose");
const cors = require("cors");

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use("/api", routes);
// app.use(express.json());

// Connection url
const uri = "mongodb://login_db:27017/login";

// connect to db
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err: any) => {
    if (err) {
      console.log(err.message);
      console.log(err);
    } else {
      console.log("Connected to MongoDb");
    }
  }
);

app.listen(3000, () => console.log("Starting Server on port 3000"));
