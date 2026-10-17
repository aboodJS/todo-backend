import express, { json, urlencoded } from "express";
import cors from "cors";
import "dotenv/config";
import { sql } from "./db.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { createAuthToken, createRefreshToken } from "./tokens.js";
import { checkTokens, verifyUser } from "./middleware.js";
import jsonwebtoken from "jsonwebtoken";

const app = express();

app.use(cors({ credentials: true, origin: [`${process.env.FR_URI}`] }));
app.use(json());
app.use(urlencoded());
app.use(cookieParser());

// signup endpoint
app.post("/signup", async (req, res) => {
  console.log(res.body);
  try {
    const hashedPassword = bcrypt.hashSync(req.body.passwd, 12, (err, hash) => {
      if (err) {
        return err;
      } else {
        return hash;
      }
    });
    const result = await sql`
        INSERT INTO users (username ,email, password)
        VALUES (${req.body.username},${req.body.email}, ${hashedPassword});`;

    res.json("done");
  } catch (error) {
    res.status(409).json(error);
  }
});

// login endpoint
app.post("/login", async (req, res) => {
  try {
    const data = await sql`SELECT *
    FROM users
    WHERE username = ${req.body.username};`;
    const result = bcrypt.compareSync(
      req.body.passwd,
      data[0].password,
      (err, rs) => {
        if (err) {
          throw new Error(err);
        } else {
          return rs;
        }
      },
    );

    if (result === true) {
      const refreshToken = createRefreshToken(
        data[0].id,
        process.env.REFRESH_TOKEN_SECRET,
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.json(
        JSON.stringify({
          loggedin: true,
          token: createAuthToken(data[0].id, process.env.AUTH_TOKEN_SECRET),
        }),
      );
    } else {
      res.status(403).json({ loggedin: false });
    }
  } catch (error) {
    res.status(500).json({ loggedin: false });
  }
});

app.use("/todos", checkTokens);

app.post("/todos", async (req, res) => {
  try {
    const userId = jsonwebtoken.decode(
      req.cookies.jwt,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err === null) {
          return decoded;
        } else {
          throw new Error(err);
        }
      },
    );

    const query =
      await sql`INSERT INTO todos (title, description, user_id) VALUES (${req.body.taskTitle}, ${req.body.taskDescription}, ${userId.id});`;
    res.status(200).json({ msg: "operation complete" });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/todos", async (req, res) => {
  try {
    const userId = jsonwebtoken.decode(
      req.cookies.jwt,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err === null) {
          return decoded;
        } else {
          throw new Error(err);
        }
      },
    );
    const data = await sql`SELECT * FROM todos WHERE user_id = ${userId.id};`;
    res.status(200).json({ todos: data });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.use("/delete_todo", checkTokens);

app.post("/delete_todo", async (req, res) => {
  try {
    const request = await sql`DELETE FROM todos WHERE id = ${req.body.taskId};`;
    res.json("done");
  } catch (error) {
    res.status(500).json(error);
  }
});

app.use("/edit_todo", checkTokens);

app.post("/edit_todo", async (req, res) => {
  try {
    const request = await sql`UPDATE todos
  SET title = ${req.body.taskTitle},
      description = ${req.body.taskDesc} WHERE id = ${req.body.taskId};`;
    res.json(request);
  } catch (error) {
    res.json(error);
  }
});

app.listen(3000, () => {
  console.log(`server running on: ${process.env.SERVER_URI}`);
});
