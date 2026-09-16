import express, { json, urlencoded } from "express";
import cors from "cors";
import "dotenv/config";
import { sql } from "./db.js";

import bcrypt from "bcrypt";

const app = express();

app.use(cors("*"));
app.use(json());
app.use(urlencoded());

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const hashedPassword = bcrypt.hashSync(
    req.body.passwd[0],
    12,
    (err, hash) => {
      if (err) {
        return err;
      } else {
        return hash;
      }
    },
  );
  const result = await sql`
      INSERT INTO users (username ,email, password)
      VALUES (${req.body.username},${req.body.email}, ${hashedPassword});`;
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
