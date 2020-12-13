import crypto from "crypto";
import jwt from "jwt-simple";
import { NewToken, Token } from "models/auth";
import { ExpiredTokenError, InvalidTokenError } from "models/errors";
import { ObjectId } from "mongodb";

/**
 * Generate a SHA256 hash from the users password
 * @param password 
 */
export const generateHash = (password: string): string => crypto.createHash("sha256").update(password).digest("hex");

/**
 * Generate a JWT
 * @param userId 
 */
export const generateToken = (userId: ObjectId) => jwt.encode({ issuedAt: Math.floor(Date.now() / 1000), userId }, process.env.JWT_KEY, "HS256");

/**
 * Decode JWT
 * @param token
 */
export const decodeJwtToken = (token: string): Token => {
   let decodedToken;
   try {
      decodedToken = jwt.decode(token, process.env.JWT_KEY, false, "HS256") as Token;
   }
   catch (error) {
      if (error.message === "Signature verification failed")
         throw new InvalidTokenError();
      throw error;
   }
   const issuedPlus7Days = decodedToken.issuedAt + (60 * 60 * 24 * 7);
   const currentSeconds = Date.now() / 1000;
   if (issuedPlus7Days <= currentSeconds)
      throw new ExpiredTokenError();
   return decodedToken;
}

/**
 * Decode JWT
 * @param token
 */
export const decodeJwtTokenNew = (token: string): NewToken => {
   let decodedToken;
   try {
      decodedToken = jwt.decode(token, process.env.JWT_KEY, false, "HS256") as NewToken;
   }
   catch (error) {
      if (error.message === "Signature verification failed")
         throw new InvalidTokenError();
      throw error;
   }
   const issuedPlus7Days = decodedToken.issuedAt + (60 * 60 * 24 * 7);
   const currentSeconds = Date.now() / 1000;
   if (issuedPlus7Days <= currentSeconds)
      throw new ExpiredTokenError();
   return decodedToken;
}