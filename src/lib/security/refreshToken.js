const { generateKey } = require("utils/random");
const ms = require("ms");

const getExpiration = () => Date.now() + getExpirationLength();

/**
 * 
 * @returns Expiration length (7 days)
 */
const getExpirationLength = () => ms(process.env.REFRESH_TOKEN_EXPIRATION);

const generateRefreshToken = (userId) => {
   const token = generateKey();
   const expires = getExpiration();
   return {
      userId,
      token,
      expires
   };
};

module.exports = {
   getExpirationLength,
   generateRefreshToken
};