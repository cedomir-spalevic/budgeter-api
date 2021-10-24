import { generateCode, generateKey } from "../../utils/random.js";

const getExpiration = () => {
   const now = Date.now();
   const expirationLength = getExpirationLength();
   return now + expirationLength;
};

/**
 * 
 * @returns Expiration length (5 minutes)
 */
export const getExpirationLength = () => 1000 * 60 * 5;

/**
 * @param {*} req - express req object
 * @param {*} userIdentifier - email or phone number,
 * @param {*} userIdentifierType - 'EMAIL' or 'PHONE'
 */
export const generateOneTimeCode = (req, userIdentifier, userIdentifierType) => {
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

export const isOneTimeCode = (code) => code && code.toString().match(/^[0-9]{6}$/);