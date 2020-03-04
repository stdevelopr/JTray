import express, { Application, Request, Response, NextFunction } from "express";
const User = require("./models.ts");
const secretKey: String = "secretkey";
const jwt = require("jsonwebtoken");
import { builtinModules } from "module";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to auth API"
  });
});

router.post("/register", async (req: Request, res: Response) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    admin: req.body.admin
  });
  try {
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", (req: Request, res: Response) => {
  const user = req.body.user;
  const password = req.body.password;

  // mock user
  const users = {
    id: 1,
    username: "dev",
    password: "dev",
    admin: true,
    email: "stdevelopr@gmail.com"
  };
  if (users.username == user && users.password == password) {
    jwt.sign(users, secretKey, (err: any, token: string) => {
      res.status(200).json({ token });
    });
  } else res.status(401).send({ error: "invalid user" });
});

router.post("/login/verify", (req: Request, res: Response) => {
  const token: string = req.body.token;
  try {
    const decoded = jwt.verify(token, secretKey);
    res.send(true);
  } catch (err) {
    res.send(false);
  }
});

module.exports = router;
