import { decodeJwtToken } from "services/internal/security";

export const processVerify = (token: any) => {
   // Try to decode the JWT Token
   decodeJwtToken(token);
}