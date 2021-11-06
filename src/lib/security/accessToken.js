const jwt = require("jsonwebtoken");
const { BudgeterError } = require("lib/middleware/error");
const ms = require("ms");
const { getConfig } = require("config");

const getExpiration = () => Date.now() + getExpirationLength();

/**
 *
 * @returns Expiration length (15 minutes)
 */
const getExpirationLength = () => ms(getConfig("ACCESS_TOKEN_EXPIRATION"));

const generateAccessToken = (userId, refreshToken) => {
   const expires = getExpiration();
   const payload = { userId, refreshToken };
   const token = jwt.sign(payload, getConfig("JWT_SECRET_KEY"), {
      algorithm: "HS256",
      expiresIn: "15 mins"
   });
   return { token, expires };
};

const decodeAccessToken = (token) => {
   try {
      return jwt.verify(token, getConfig("JWT_SECRET_KEY"), {
         algorithms: ["HS256"]
      });
   } catch (error) {
      throw new BudgeterError(401, "Unauthorized");
   }
};

module.exports = {
   getExpirationLength,
   generateAccessToken,
   decodeAccessToken
};
