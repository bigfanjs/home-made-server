const JWT = require("jsonwebtoken");
const config = require("config");

module.exports = (user) => {
  return JWT.sign({
    iss: "ApiAuth",
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, config.get("JWT_SECRET"));
};