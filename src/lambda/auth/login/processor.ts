import { NoUserEmailFoundError, UnauthorizedError } from "models/errors";
import { AuthResponse, ConfirmationResponse } from "models/responses";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateAccessToken } from "services/internal/security/accessToken";
import { generateRefreshToken } from "services/internal/security/refreshToken";
import { generateHash } from "services/internal/security/hash";
import { sendVerification } from "services/internal/verification";
import { LoginBody } from "./validator";

export interface LoginResponse {
   status: number;
   response: AuthResponse | ConfirmationResponse;
}

export const processLogin = async (
   loginBody: LoginBody
): Promise<LoginResponse> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const refreshTokenService = budgeterClient.getRefreshTokenCollection();

   const user = await usersService.find({
      $or: [
         {
            $and: [{ email: { $ne: null } }, { email: loginBody.email }]
         },
         {
            $and: [
               { phoneNumber: { $ne: null } },
               { phoneNumber: loginBody.phoneNumber }
            ]
         }
      ]
   });
   if (!user) throw new NoUserEmailFoundError();

   // We only want to check if the hashed password exists in the DB
   // We don't want to send the hashed password in the database in transit at all.
   // Which is why we only do a count
   const userAuthRecordsAmount = await usersAuthService.count({
      userId: user._id,
      hash: generateHash(loginBody.password)
   });
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

   const refreshToken = generateRefreshToken(user._id);
   const accessToken = generateAccessToken(
      user._id.toHexString(),
      refreshToken.token
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
