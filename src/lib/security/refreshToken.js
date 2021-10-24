import { getRandomKey } from "../../utils/random.js";

const getExpiration = () => {
   const now = Date.now();
   const expirationLength = getExpirationLength();
   return now + expirationLength;
};

/**
 * 
 * @returns Expiration length (7 days)
 */
export const getExpirationLength = () => 1000 * 60 * 60 * 24 * 7;

export const generateRefreshToken = (userId) => {
   const token = getRandomKey();
   const expires = getExpiration();
   return {
      userId,
      token,
      expires
   };
};