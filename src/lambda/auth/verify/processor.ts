import { decodeJwtToken } from "services/internal/security";

export const processVerify = async (token: any) => {
   // Try to decode the JWT Token
   const valid = decodeJwtToken(token);

   return valid ? true : false;
}