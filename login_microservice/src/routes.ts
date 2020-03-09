import express, { Application, Request, Response, NextFunction } from "express";
import User, { IUser } from "./models";
import * as bcryptjs from "bcryptjs";

import * as jwt from "jsonwebtoken";

const secretKey: jwt.Secret = "secretkey";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to auth API"
  });
});

router.post("/register", async (req: Request, res: Response) => {
  const username = req.body.username;
  try {
    User.findOne({ username: username }, async function(err: any, user: IUser) {
      if (!user) {
        const hashedpass = await bcryptjs.hash(req.body.password, 10);
        const user: IUser = new User({
          username: req.body.username,
          password: hashedpass,
          admin: req.body.admin
        });
        try {
          const savedUser = await user.save();
          res.status(200).json(savedUser);
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        console.log("user exists: ", username);
        res.status(500).json("User already exists");
      }
    });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json(err);
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    User.findOne({ username: req.body.username }, async function(
      err: any,
      user: IUser
    ) {
      if (user) {
        if (await bcryptjs.compare(req.body.password, user.password)) {
          const jwt_user = {
            username: user.username,
            admin: user.admin
          };
          jwt.sign(jwt_user, secretKey, (err: any, token: string) => {
            res.status(200).json({ token });
          });
        } else {
          res.status(401).send({ error: "invalid password!" });
        }
      } else {
        console.log("Cannot find the user!", req.body.username);
        res.status(500).json("Cannot find the user!");
      }
    });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).send();
  }
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
