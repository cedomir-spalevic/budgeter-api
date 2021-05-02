import { RefreshToken } from "models/data/refreshToken";
import { ObjectId } from "mongodb";
import { getRandomKey } from "./randomKey";

/**
 * Generate the token and expiration time of a Refresh Token
 */
export const generateRefreshToken = (
   userId: ObjectId,
   isAdmin: boolean
): Partial<RefreshToken> => {
   const refreshToken = getRandomKey();
   const expires = Date.now() + 1000 * 60 * 60 * 24 * 7; // Expires in 7 days
   return { userId, isAdmin, token: refreshToken, expiresOn: expires };
};
