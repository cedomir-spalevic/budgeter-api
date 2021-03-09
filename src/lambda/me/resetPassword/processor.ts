import { GeneralError, UnauthorizedError } from "models/errors";
import BudgeterMongoClient from "services/external/mongodb/client";
import { PasswordResetBody } from ".";
import { UserAuth } from "models/data/userAuth";
import { generateHash } from "services/internal/security/hash";
import { generateAccessToken } from "services/internal/security/accessToken";
import { generateRefreshToken } from "services/internal/security/refreshToken";
import { AuthResponse } from "models/responses";

export const processPasswordReset = async (
   passwordResetBody: PasswordResetBody
): Promise<AuthResponse> => {
   // Test for a valid password
   if (!passwordResetBody.password)
      throw new GeneralError("Password cannot be blank");

   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();
   const usersService = budgeterClient.getUsersCollection();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const refreshTokenService = budgeterClient.getRefreshTokenCollection();

   // Check if one time code exists
   const otc = await oneTimeCodeService.find({
      key: passwordResetBody.key,
      completed: true,
      type: "passwordReset",
   });
   if (!otc) throw new UnauthorizedError();

   // Get User and update email verification
   const user = await usersService.getById(otc.userId.toHexString());
   user.isEmailVerified = true;
   await usersService.update(user);

   // Update user auth
   const userAuth: Partial<UserAuth> = {
      userId: otc.userId,
      hash: generateHash(passwordResetBody.password),
   };
   await usersAuthService.replace({ userId: otc.userId }, userAuth);

   // Remove all refresh tokens for this user
   await refreshTokenService.deleteAll({ userId: otc.userId });

   // Generate Access Token and Refresh Token
   const refreshToken = generateRefreshToken(otc.userId);
   const accessToken = generateAccessToken(
      otc.userId.toHexString(),
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
