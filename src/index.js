import express, { json, urlencoded } from "express";
import cors from "cors";
import "dotenv/config";
import { sql } from "./db.js";

const app = express();

app.use(cors("*"));
app.use(json());
app.use(urlencoded());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const result = await sql`
      INSERT INTO users (username ,email, password)
      VALUES (${req.body.username},${req.body.email}, ${req.body.passwd[0]});`;
  const data = result;
  res.redirect("http://localhost:5173/");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(3000, () => {
  console.log(`server running on: ${process.env.SERVER_URI}`);
});
