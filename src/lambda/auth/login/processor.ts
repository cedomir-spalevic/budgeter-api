import {
   GeneralError,
   NoUserEmailFoundError,
   UnauthorizedError,
} from "models/errors";
import { AuthResponse, ConfirmationResponse } from "models/responses";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateAccessToken } from "services/internal/security/accessToken";
import { generateRefreshToken } from "services/internal/security/refreshToken";
import { generateHash } from "services/internal/security/hash";
import { LoginBody } from ".";
import { generateOneTimeCode } from "services/internal/security/oneTimeCode";
import { newAccountConfirmationTemplate } from "views/new-account-confirmation";
import { sendEmail } from "services/external/aws/ses";

export const processSignIn = async (
   loginBody: LoginBody
): Promise<{
   status: number;
   response: AuthResponse | ConfirmationResponse;
}> => {
   // Check if email and password are in the request
   if (!loginBody.email) throw new GeneralError("Email cannot be blank");
   if (!loginBody.password) throw new GeneralError("Password cannot be blank");

   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const refreshTokenService = budgeterClient.getRefreshTokenCollection();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();

   // Set email to all lowercase
   const email = loginBody.email.toLowerCase();

   // Look for a user with this email address
   const user = await usersService.find({ email });
   if (!user) throw new NoUserEmailFoundError();

   // Next scan the users password
   const count = await usersAuthService.count({
      userId: user._id,
      hash: generateHash(loginBody.password),
   });
   if (count < 1) throw new UnauthorizedError();

   // If the users email is not verified, force them to verify
   if (!user.isEmailVerified) {
      // Create OTC
      const result = generateOneTimeCode(user._id, "emailVerification");
      await oneTimeCodeService.create(result.code);

      // Send email verification with the confirmation code
      const html = newAccountConfirmationTemplate(result.code.code.toString());
      await sendEmail(email, "Budgeter - verify your email", html);

      // Return Key identifier
      return {
         status: 202,
         response: {
            expires: result.expires,
            key: result.code.key,
         },
      };
   }

   // Generate Access Token and Refresh Token
   const refreshToken = generateRefreshToken(user._id);
   const accessToken = generateAccessToken(
      user._id.toHexString(),
      refreshToken.token
   );

   // Save Refresh Token in DB
   await refreshTokenService.create(refreshToken);

   // Return auth response
   return {
      status: 200,
      response: {
         accessToken: accessToken.token,
         expires: accessToken.expires,
         refreshToken: refreshToken.token,
      },
   };
};
