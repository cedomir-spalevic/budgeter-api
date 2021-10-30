import jwt from "jsonwebtoken";
import { BudgeterError } from "../middleware/error.js";
import ms from "ms";

const getExpiration = () => Date.now() + getExpirationLength();

/**
 * 
 * @returns Expiration length (15 minutes)
 */
export const getExpirationLength = () => ms(process.env.ACCESS_TOKEN_EXPIRATION);

export const generateAccessToken = (userId, refreshToken) => {
   const expires = getExpiration();
   const payload = { userId, refreshToken };
   const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
      algorithm: "HS256",
      expiresIn: "15 mins"
   });
   return { token, expires };
};

export const decodeAccessToken = (token) => {
   try {
      return jwt.verify(token, process.env.JWT_ACCESS_TOKEN, {
         algorithms: ["HS256"]
      });
   }
   catch(error) {
      throw new BudgeterError(401, "Unauthorized");
   }
};