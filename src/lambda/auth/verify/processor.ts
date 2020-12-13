import { decodeJwtToken } from "services/internal/security";

export const processVerify = (token: string) => {
   // Try to decode the JWT Token
   decodeJwtToken(token);
}