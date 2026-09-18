import { jsonwebtoken as jwt } from "jsonwebtoken";

function createAuthToken(userData, key) {
  const token = jwt.sign(userData, key, { expiresIn: "10m" });
  return token;
}

function createRefreshToken(userData, key) {
  const token = jwt.sign(userData, key, { expiresIn: "1day" });
  return token;
}

export default { createAuthToken, createRefreshToken };
