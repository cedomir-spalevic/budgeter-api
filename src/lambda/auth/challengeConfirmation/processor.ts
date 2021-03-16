import { UnauthorizedError } from "models/errors";
import { AuthResponse } from "models/responses";
import { RegisterConfirmationBody } from ".";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateAccessToken } from "services/internal/security/accessToken";
import { generateRefreshToken } from "services/internal/security/refreshToken";

export const processRegisterConfirmation = async (
   registerConfirmationBody: RegisterConfirmationBody
): Promise<AuthResponse> => {
   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();
   const refreshTokenService = budgeterClient.getRefreshTokenCollection();

   // Look for an OTC with the given key and code
   let oneTimeCode = await oneTimeCodeService.find({
      key: registerConfirmationBody.key,
      code: registerConfirmationBody.code,
   });
   if (!oneTimeCode || oneTimeCode.expiresOn < Date.now())
      throw new UnauthorizedError();

   // Set the OTC has completed
   oneTimeCode.completed = true;
   oneTimeCode = await oneTimeCodeService.update(oneTimeCode);

   // If one time code was for email verification, update users isEmailVerified field to true
   if (oneTimeCode.type === "emailVerification") {
      const user = await usersService.getById(oneTimeCode.userId.toHexString());
      user.isEmailVerified = true;
      await usersService.update(user);
   }

   // Generate Access Token and Refresh Token
   const refreshToken = generateRefreshToken(oneTimeCode.userId);
   const accessToken = generateAccessToken(
      oneTimeCode.userId.toHexString(),
      refreshToken.token
   );

   // Save Refresh Token in DB
   await refreshTokenService.create(refreshToken);

   // Return auth response
   return {
      accessToken: accessToken.token,
      expires: accessToken.expires,
      refreshToken: refreshToken.token,
   };
};
