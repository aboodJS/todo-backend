import jsonwebtoken from "jsonwebtoken";
import { createAuthToken } from "./tokens";

const checkCookies = (req, res, next) => {
  let dataName;
  jsonwebtoken.verify(
    req.headers.authentication.split(" ")[1],
    process.env.AUTH_TOKEN_SECRET,
    (err, decoded) => {
      if (err === null) {
        console.log(decoded);
      }
    },
  );
  next();
};

export default checkCookies;
