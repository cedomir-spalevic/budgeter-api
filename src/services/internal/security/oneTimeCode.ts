import { OneTimeCode, OneTimeCodeType } from "models/data/oneTimeCode";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";

/**
 * Generat the key, code and expiration of an OTC
 */
export const generateOneTimeCode = (
   userId: ObjectId,
   type: OneTimeCodeType
): { expires: number; code: Partial<OneTimeCode> } => {
   const key = uuid();
   const code = Math.floor(100000 + Math.random() * 900000);
   const now = Date.now();
   const expires = now + 1000 * 60 * 5; // Expires in 5 minutes
   return {
      expires: expires - now,
      code: {
         userId,
         key,
         code,
         expiresOn: expires,
         type,
      },
   };
};

/**
 * Generate a random one time code
 */
export const generateRandomOneTimeCode = (): {
   expires: number;
   key: string;
} => ({ expires: 1000 * 60 * 5, key: uuid() });
