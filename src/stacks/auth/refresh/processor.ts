import { UnauthorizedError } from "models/errors";
import { AuthResponse } from "models/responses";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateAccessToken } from "services/internal/security/accessToken";
import { RefreshRequest } from "./type";

export const processRefresh = async (
   request: RefreshRequest
): Promise<AuthResponse> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const refreshTokenService = budgeterClient.getRefreshTokenCollection();

   const refreshToken = await refreshTokenService.find({
      token: request.refreshToken
   });

   if (!refreshToken || refreshToken.expiresOn < Date.now())
      throw new UnauthorizedError();

   const accessToken = generateAccessToken(
      refreshToken.userId.toHexString(),
      refreshToken.token,
      refreshToken.isAdmin
   );

   return {
      accessToken: accessToken.token,
      expires: accessToken.expires,
      refreshToken: refreshToken.token
   };
};
