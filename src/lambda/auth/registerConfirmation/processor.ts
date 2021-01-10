import { UnauthorizedError } from "models/errors";
import { AuthResponse } from "models/responses";
import UsersService from "services/external/mongodb/users";
import ConfirmationCodesService from "services/external/mongodb/confirmationCodes";
import { generateToken } from "services/internal/security";
import { RegisterConfirmationBody } from ".";

export const processRegisterConfirmation = async (registerConfirmationBody: RegisterConfirmationBody): Promise<AuthResponse> => {
   const usersService = await UsersService.getInstance();
   const confirmationCodesService = await ConfirmationCodesService.getInstance();

   const confirmationCode = await confirmationCodesService.find(registerConfirmationBody.key, registerConfirmationBody.code);
   if (!confirmationCode)
      throw new UnauthorizedError();

   // Delete confirmation code record
   await confirmationCodesService.delete(confirmationCode._id);

   // Update user
   const user = await usersService.getById(confirmationCode.userId);
   user.isEmailVerified = true;
   await usersService.update(user);

   // Generate token
   const token = generateToken(user._id);

   return { token }
}