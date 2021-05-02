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
   if (!passwordResetBody.password)
      throw new GeneralError("Password cannot be blank");

   const budgeterClient = await BudgeterMongoClient.getInstance();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();
   const usersService = budgeterClient.getUsersCollection();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const refreshTokenService = budgeterClient.getRefreshTokenCollection();

   // To reset a password, the user will have to go through a challenge with a type of a passwordReset.
   // But we will only allow this person to reset their password IF they passed the challenge. So from the /auth/challengeConfirmation
   // endpoint, we set the completed property to True. We only let the user change their password if the completed property is True
   // for the provided key
   const oneTimeCode = await oneTimeCodeService.find({
      key: passwordResetBody.key,
      completed: true,
      type: "passwordReset"
   });
   if (!oneTimeCode) throw new UnauthorizedError();

   const user = await usersService.getById(oneTimeCode.userId.toHexString());
   user.isMfaVerified = true;
   await usersService.update(user);

   const userAuth: Partial<UserAuth> = {
      userId: oneTimeCode.userId,
      hash: generateHash(passwordResetBody.password)
   };
   await usersAuthService.replace({ userId: oneTimeCode.userId }, userAuth);

   // If the user is resetting their password, then we want to kill all other sessions. This is easily done by removing all of the refresh tokens for
   // this user. So then, the /refresh endpoint will never find any valid refresh tokens and force them to sign in again. BUT, our access tokens expire
   // after 15 minutes. So realistically, there is a possibility that another session could still continue to send requests for another 15 minutes without
   // having to put in the new password. Although this is not good if this is a sort of identity attack. We could always set the access token
   // to expire after 5 minutes or so.
   await refreshTokenService.deleteAll({ userId: oneTimeCode.userId });

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
