import { GeneralError, UnauthorizedError } from "models/errors";
import OneTimeCodeService from "services/external/mongodb/otc";
import UserAuthService from "services/external/mongodb/userAuth";
import UsersService from "services/external/mongodb/users";
import { PasswordResetBody } from ".";

export const processPasswordReset = async (passwordResetBody: PasswordResetBody): Promise<void> => {
   if (!passwordResetBody.password)
      throw new GeneralError("Password cannot be blank");

   const oneTimeCodeService = await OneTimeCodeService.getInstance();
   const usersAuthService = await UserAuthService.getInstance();
   const usersService = await UsersService.getInstance();

   // Check if one time code exists
   const otc = await oneTimeCodeService.find({ key: passwordResetBody.key, completed: true, type: "passwordReset" });
   if (!otc)
      throw new UnauthorizedError();

   // Update password
   await usersAuthService.update(otc.userId, passwordResetBody.password);

   // Get and update to user force logout
   const user = await usersService.getById(otc.userId);
   user.forceLogout = true;
   await usersService.update(user);

   // Delete one time code
   await oneTimeCodeService.delete(otc._id);
}