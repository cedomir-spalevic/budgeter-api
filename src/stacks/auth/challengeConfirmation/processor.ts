import { UnauthorizedError } from "models/errors";
import { AuthResponse } from "models/responses";
import BudgeterMongoClient from "services/external/mongodb/client";
import { logInfo } from "services/internal/logging";
import { generateAccessToken } from "services/internal/security/accessToken";
import { generateRefreshToken } from "services/internal/security/refreshToken";
import { ChallengeConfirmationRequest } from "./type";

export const processChallengeConfirmation = async (
   request: ChallengeConfirmationRequest
): Promise<AuthResponse> => {
   const { key, code } = request;
   logInfo("Challenge Confirmation Request:");
   logInfo(request);

   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();
   const refreshTokenService = budgeterClient.getRefreshTokenCollection();

   let oneTimeCode = await oneTimeCodeService.find({
      key: key,
      code: code
   });
   const isExpired = oneTimeCode.expiresOn < Date.now();
   logInfo("One time code:");
   logInfo(oneTimeCode);
   logInfo(`Is Expired?: ${isExpired}`);
   if (!oneTimeCode || isExpired)
      throw new UnauthorizedError();

   oneTimeCode.completed = true;
   oneTimeCode = await oneTimeCodeService.update(oneTimeCode);

   const user = await usersService.getById(oneTimeCode.userId.toHexString());
   if (
      oneTimeCode.type === "userVerification" ||
      oneTimeCode.type === "newUserVerification"
   ) {
      user.isMfaVerified = true;
      await usersService.update(user);
   }
   logInfo("User:");
   logInfo(user);

   const refreshToken = generateRefreshToken(oneTimeCode.userId, user.isAdmin);
   const accessToken = generateAccessToken(
      oneTimeCode.userId.toHexString(),
      refreshToken.token,
      user.isAdmin
   );

   await refreshTokenService.create(refreshToken);

   return {
      accessToken: accessToken.token,
      expires: accessToken.expires,
      refreshToken: refreshToken.token
   };
};
