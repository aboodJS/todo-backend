import jsonwebtoken from "jsonwebtoken";

function createAuthToken(userData, key) {
  const token = jsonwebtoken.sign({ username: userData }, key, {
    expiresIn: "10m",
  });
  return token;
}

function createRefreshToken(userData, key) {
  const token = jsonwebtoken.sign({ username: userData }, key, {
    expiresIn: "1d",
  });
  return token;
}

export { createAuthToken, createRefreshToken };
