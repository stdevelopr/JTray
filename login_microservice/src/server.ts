import express, { Application, Request, Response, NextFunction } from "express";
var cors = require("cors");
const jwt = require("jsonwebtoken");

const app: Application = express();
app.use(cors());
app.use(express.json());
const secretKey: String = "secretkey";

app.get("/api", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to auth API"
  });
});

app.post("/api/login", (req: Request, res: Response) => {
  const user = req.body.user;
  const password = req.body.password;

  // mock user
  const users = {
    id: 1,
    username: "dev",
    password: "dev",
    email: "stdevelopr@gmail.com"
  };
  if (users.username == user && users.password == password) {
    jwt.sign({ user }, secretKey, (err: any, token: string) => {
      res.status(200).json({ token });
    });
  } else res.status(401).send({ error: "invalid user" });
});

app.post("/api/login/verify", (req: Request, res: Response) => {
  const token: string = req.body.token;
  try {
    const decoded = jwt.verify(token, secretKey);
    res.send(true);
  } catch (err) {
    res.send(false);
  }
});

app.listen(3000, () => console.log("server started on port 3000"));
