import { RefreshToken } from "models/data/refreshToken";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";

/**
 * Generate the token and expiration time of a Refresh Token
 */
export const generateRefreshToken = (userId: ObjectId): Partial<RefreshToken> => {
   const refreshToken = uuid();
   const expires = Date.now() + (1000 * 60 * 60 * 24 * 7); // Expires in 7 days
   return { userId, token: refreshToken, expiresOn: expires };
}