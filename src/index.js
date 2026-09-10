import express, { json, urlencoded } from "express";
import cors from "cors";
import "dotenv/config";
import { sql } from "./db.js";

const app = express();

app.use(cors("*"));
app.use(json());
app.use(urlencoded());

app.post("/signup", async (req, res) => {
  const result = await sql`SELECT version()`;
  const { version } = result[0];
  res.send(version);
});

app.post("/login", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(3000, () => {
  console.log(`server running on: ${process.env.SERVER_URI}`);
});
