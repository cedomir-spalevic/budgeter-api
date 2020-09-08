import crypto from "crypto";
import jwt from "jwt-simple";
import { Token } from "models/auth";

const jwtKey = "mYq3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D*G-KaPdSgVkYp2s5v8y/B?E(H+MbQe";

/**
 * Generate a SHA256 hash from the users password
 * @param password 
 */
export const generateHash = (password: string): string => crypto.createHash("sha256").update(password).digest("hex");

/**
 * Generate a JWT
 * @param userId 
 */
export const generateToken = (userId: string) => jwt.encode({ issuedAt: Math.floor(Date.now() / 1000), userId }, jwtKey, "HS256");

/**
 * Decode JWT
 * @param token
 */
export const decodeJwtToken = (token: string): Token => {
   const decodedToken = jwt.decode(token, jwtKey, false, "HS256") as Token;
   const issuedPlus7Days = decodedToken.issuedAt + (60 * 60 * 24 * 7);
   const currentSeconds = Date.now() / 1000;
   if (issuedPlus7Days <= currentSeconds)
      throw new Error();
   return decodedToken;
}