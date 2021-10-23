import { v4 as generateGuid } from "uuid";

const generateCode = () => Math.floor(100000 + Math.random() * 900000);

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
 * @param {*} userIdentifier - email or phone number
 */
export const generateOneTimeCode = (req, userIdentifier) => {
   const key = generateGuid();
   const code = generateCode();
   const expiresOn = getExpiration();
   const oneTimeCode = {
      userIdentifier,
      key,
      code,
      expiresOn
   };
   req.logger.info("One Time Code generated");
   req.logger.info(oneTimeCode);
   return oneTimeCode;
};