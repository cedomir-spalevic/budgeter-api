import { RefreshToken } from "models/schemas/refreshToken";
import { ObjectId } from "mongodb";
import { getRandomKey } from "./randomKey";

/**
 * Generate the token and expiration time of a Refresh Token
 */
export const generateRefreshToken = (
   userId: ObjectId
): Partial<RefreshToken> => {
   const refreshToken = getRandomKey();
   const expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // Expires in 7 days
   return { userId, token: refreshToken, expiresOn: expires };
};
