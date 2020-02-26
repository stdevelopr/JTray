"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express_1.default();
app.use(cors());
app.use(express_1.default.json());
const secretKey = "secretkey";
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to auth API"
  });
});
app.post("/api/login", (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  console.log("aui");
  // mock user
  const users = {
    id: 1,
    username: "dev",
    password: "dev",
    email: "stdevelopr@gmail.com"
  };
  if (users.username == user && users.password == password) {
    jwt.sign({ user }, secretKey, (err, token) => {
      res.status(200).json({ token });
    });
  } else res.status(401).send({ error: "invalid user" });
});
app.post("/api/login/verify", (req, res) => {
  const token = req.body.token;
  try {
    const decoded = jwt.verify(token, secretKey);
    res.send(true);
  } catch (err) {
    res.send(false);
  }
});
app.listen(3000, () => console.log("server started on port 3000"));
