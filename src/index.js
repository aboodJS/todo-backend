const express = require("express");
const cors = require("cors");
const env = require("dotenv").config();

const app = express();

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded());

app.post("/signup", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(3000, () => {
  console.log(`server running on: ${process.env.SERVER_URI}`);
});
