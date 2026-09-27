import jsonwebtoken from "jsonwebtoken";
import { createAuthToken } from "./tokens";

const checkCookies = (req, res, next) => {
  jsonwebtoken.verify(
    req.headers.authentication.split(" ")[1],
    process.env.AUTH_TOKEN_SECRET,
    (err, decoded) => {
      if (err === null) {
        console.log(decoded);
        next();
      } else {
        jsonwebtoken.verify(
          req.cookies.jwt,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if (err === null) {
              req.headers.Authentication = jsonwebtoken.sign(
                decoded.username,
                process.env.AUTH_TOKEN_SECRET,
              );
              next();
            } else {
              res
                .status(403)
                .json({ error: "session expired, please Login again" });
            }
          },
        );
      }
    },
  );
};

export default checkCookies;
