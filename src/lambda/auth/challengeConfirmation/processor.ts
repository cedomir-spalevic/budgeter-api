import { UnauthorizedError } from "models/errors";
import { AuthResponse } from "models/responses";
import UsersService from "services/external/mongodb/users";
import OneTimeCodeService from "services/external/mongodb/otc";
import { generateToken } from "services/internal/security";
import { RegisterConfirmationBody } from ".";

export const processRegisterConfirmation = async (registerConfirmationBody: RegisterConfirmationBody): Promise<AuthResponse> => {
   const usersService = await UsersService.getInstance();
   const oneTimeCodeService = await OneTimeCodeService.getInstance();

   const otc = await oneTimeCodeService.find({ key: registerConfirmationBody.key, code: registerConfirmationBody.code });
   if (!otc)
      throw new UnauthorizedError();

   if (otc.type === "passwordReset") {
      // If the type is passwordReset, then completed
      await oneTimeCodeService.complete(otc);
   }
   else if (otc.type === "emailVerification") {
      // If one time code was for email verification, delete record and update users isEmailVerified field to true
      await oneTimeCodeService.delete(otc._id);
      const user = await usersService.getById(otc.userId);
      user.isEmailVerified = true;
      await usersService.update(user);
   }
   // Generate token
   const token = generateToken(otc.userId);

   return { token }
}