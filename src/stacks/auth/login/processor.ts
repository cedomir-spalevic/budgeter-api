import { NoUserEmailFoundError, UnauthorizedError } from "models/errors";
import BudgeterMongoClient from "services/external/mongodb/client";
import { logInfo } from "services/internal/logging";
import { generateAccessToken } from "services/internal/security/accessToken";
import { generateHash } from "services/internal/security/hash";
import { generateRefreshToken } from "services/internal/security/refreshToken";
import { sendVerification } from "services/internal/verification";
import { LoginRequest, LoginResponse } from "./type";

export const processLogin = async (
   request: LoginRequest
): Promise<LoginResponse> => {
   const { email, phoneNumber, password } = request;
   logInfo("Login request:");
   logInfo(request);

   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const refreshTokenService = budgeterClient.getRefreshTokenCollection();

   const user = await usersService.find({
      $or: [
         {
            $and: [{ email: { $ne: null } }, { email: email }]
         },
         {
            $and: [{ phoneNumber: { $ne: null } }, { phoneNumber: phoneNumber }]
         }
      ]
   });
   logInfo("User:");
   logInfo(user);
   if (!user) throw new NoUserEmailFoundError();

   // We only want to check if the hashed password exists in the DB
   // We don't want to send the hashed password in the database in transit at all.
   // Which is why we only do a count
   const userAuthRecordsAmount = await usersAuthService.count({
      userId: user._id,
      hash: generateHash(password)
   });
   logInfo("Auth records:");
   logInfo(userAuthRecordsAmount);
   if (userAuthRecordsAmount < 1) throw new UnauthorizedError();

   // If the users email is not verified, then we want to force them to verify
   // by sending a verification email. If executed properly, the challengeConfirmation endpoint will get invoked.
   // If not then the token will naturally expire, and our clearTokens job will delete it
   if (!user.isMfaVerified) {
      const confirmationCode = await sendVerification(user, "userVerification");

      // Return Key identifier
      return {
         status: 202,
         response: confirmationCode
      };
   }

   const refreshToken = generateRefreshToken(user._id, user.isAdmin);
   const accessToken = generateAccessToken(
      user._id.toHexString(),
      refreshToken.token,
      user.isAdmin
   );

   await refreshTokenService.create(refreshToken);

   return {
      status: 200,
      response: {
         accessToken: accessToken.token,
         expires: accessToken.expires,
         refreshToken: refreshToken.token
      }
   };
};
