import { generateKey } from "../../utils/random.js";
import ms from "ms";

const getExpiration = () => Date.now() + getExpirationLength();

/**
 * 
 * @returns Expiration length (7 days)
 */
export const getExpirationLength = () => ms(process.env.REFRESH_TOKEN_EXPIRATION);

export const generateRefreshToken = (userId) => {
   const token = generateKey();
   const expires = getExpiration();
   return {
      userId,
      token,
      expires
   };
};