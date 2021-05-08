import jwt from "jsonwebtoken";
import { Token } from "models/auth";
import { TokenVerificationError } from "models/errors";

/**
 * Generate an Access Token and time of expiration
 */
export const generateAccessToken = (
   userId: string,
   refreshToken: string
): { token: string; expires: number } => {
   const now = Date.now();
   const expires = now + 1000 * 60 * 15; // Expires in 15 minutes
   const payload: Token = {
      issuedAt: now,
      userId,
      refreshToken
   };
   const token = jwt.sign(payload, process.env.JWT_KEY, {
      algorithm: "HS256",
      expiresIn: "15 mins"
   });
   return { token, expires: expires - now };
};

/**
 * Try to decode Access Token
 */
export const decodeAccessToken = (token: string): Token => {
   try {
      return jwt.verify(token, process.env.JWT_KEY, {
         algorithms: ["HS256"]
      }) as Token;
   } catch (error) {
      throw new TokenVerificationError();
   }
};
