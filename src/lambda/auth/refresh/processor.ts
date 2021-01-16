import {
   UnauthorizedError,
} from "models/errors";
import { AuthResponse } from "models/responses";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateAccessToken } from "services/internal/security/accessToken";
import { RefreshBody } from ".";

export const processRefresh = async (refreshBody: RefreshBody): Promise<AuthResponse> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const refreshTokenService = budgeterClient.getRefreshTokenCollection();

   // Look for a refresh token
   const refreshToken = await refreshTokenService.find({ token: refreshBody.refreshToken });

   // If the refresh token does not exist or if it has expired, then force user to log back in
   if (!refreshToken || (refreshToken.expiresOn < Date.now()))
      throw new UnauthorizedError();

   // Generate new Access Token
   const accessToken = generateAccessToken(refreshToken.userId.toHexString(), refreshToken.token);

   // Return auth response
   return {
      accessToken: accessToken.token,
      expires: accessToken.expires,
      refreshToken: refreshToken.token
   }
}