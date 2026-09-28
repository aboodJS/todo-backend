import jsonwebtoken from "jsonwebtoken";
import { createAuthToken } from "./tokens.js";

export const checkTokens = (req, res, next) => {
  jsonwebtoken.verify(
    req.headers.authentication.split(" ")[1],
    process.env.AUTH_TOKEN_SECRET,
    (err, decoded) => {
      if (err === null) {
        console.log(decoded);
        next();
        return 0;
      } else {
        jsonwebtoken.verify(
          req.cookies.jwt,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if (err === null) {
              req.headers.authentication = `Bearer ${createAuthToken(decoded.username, process.env.AUTH_TOKEN_SECRET)}`;
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

export const verifyUser = (req, res, next) => {
  jsonwebtoken.verify(
    req.headers.authentication.split(" ")[1],
    process.env.AUTH_TOKEN_SECRET,
    (err, decoded) => {
      if (err === null) {
        console.log(decoded);
        next();
      } else {
        res.status(403).json({ error: "session expired, please Login again" });
      }
    },
  );
};
export default { checkTokens, verifyUser };
