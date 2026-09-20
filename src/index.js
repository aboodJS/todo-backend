import express, { json, urlencoded } from "express";
import cors from "cors";
import "dotenv/config";
import { sql } from "./db.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { createAuthToken, createRefreshToken } from "./tokens.js";

const app = express();

app.use(cors("*"));
app.use(json());
app.use(urlencoded());
app.use(cookieParser());

// signup endpoint
app.post("/signup", async (req, res) => {
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

app.post("/login", (req, res, next) => {
  console.log(req.cookies);
  next();
});

// login endpoint
app.post(
  "/login",

  async (req, res) => {
    const data = await sql`SELECT *
                        FROM users
                        WHERE username = ${req.body.username};`;
    const result = bcrypt.compareSync(
      req.body.passwd,
      data[0].password,
      (err, rs) => {
        if (err) {
          return err;
        } else {
          return err;
        }
      },
    );

    if (result) {
      const refreshToken = createRefreshToken(
        data[0].username,
        process.env.REFRESH_TOKEN_SECRET,
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.send(
        createAuthToken(data[0].username, process.env.AUTH_TOKEN_SECRET),
      );
    }
  },
);

app.listen(3000, () => {
  console.log(`server running on: ${process.env.SERVER_URI}`);
});
