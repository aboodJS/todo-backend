const express = require("express");
const cors = require("cors");
const env = require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/signup", (req, res) => {
  res.send("hi");
});

app.get("/login", (req, res) => {
  res.send("hi");
});

app.listen(3000, () => {
  console.log(`server running on: ${process.env.SERVER_URI}`);
});
