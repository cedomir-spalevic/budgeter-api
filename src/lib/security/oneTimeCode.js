const { generateCode, generateKey } = require("utils/random");
const ms = require("ms");

const getExpiration = () => Date.now() + getExpirationLength();

/**
 * 
 * @returns Expiration length (5 minutes)
 */
const getExpirationLength = () => ms(process.env.ONE_TIME_CODE_EXPIRATION);

/**
 * @param {*} req - express req object
 * @param {*} userIdentifier - email or phone number,
 * @param {*} userIdentifierType - 'EMAIL' or 'PHONE'
 */
const generateOneTimeCode = (req, userIdentifier, userIdentifierType) => {
   const key = generateKey();
   const code = generateCode();
   const expires = getExpiration();
   const oneTimeCode = {
      userIdentifier,
      userIdentifierType,
      key,
      code,
      expires
   };
   req.logger.info("One Time Code generated");
   req.logger.info(oneTimeCode);
   return oneTimeCode;
};

const isOneTimeCode = (code) => code && code.toString().match(/^[0-9]{6}$/);

module.exports = {
   isOneTimeCode,
   generateOneTimeCode,
   getExpirationLength
};