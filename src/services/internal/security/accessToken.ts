import jwt from "jsonwebtoken";
import { Token } from "models/auth";
import { TokenVerificationError } from "models/errors";

const deriveKey = (isAdmin?: boolean) => (isAdmin === true ? process.env.JWT_ADMIN_KEY : process.env.JWT_KEY);

/**
 * Generate an Access Token and time of expiration
 */
export const generateAccessToken = (
   userId: string,
   refreshToken: string,
   isAdmin: boolean
): { token: string; expires: number } => {
   const now = Date.now();
   const expires = now + 1000 * 60 * 15; // Expires in 15 minutes
   const payload: Token = {
      issuedAt: now,
      userId,
      refreshToken
   };
   const key = deriveKey(isAdmin);
   const token = jwt.sign(payload, key, {
      algorithm: "HS256",
      expiresIn: "15 mins"
   });
   return { token, expires: expires - now };
};

/**
 * Try to decode Access Token
 */
export const decodeAccessToken = (token: string, isAdmin: boolean): Token => {
   try {
      const key = deriveKey(isAdmin);
      return jwt.verify(token, key, {
         algorithms: ["HS256"]
      }) as Token;
   } catch (error) {
      throw new TokenVerificationError();
   }
};
