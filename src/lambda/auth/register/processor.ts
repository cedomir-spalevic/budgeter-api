import { User } from "models/data";
import { AlreadyExistsError, GeneralError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import { WithId } from "mongodb";
import { sendEmail } from "services/external/aws/ses";
import UserAuthService from "services/external/mongodb/userAuth";
import UsersService from "services/external/mongodb/users";
import OneTimeCodeService from "services/external/mongodb/otc";
import { generateConfirmationCode, generateRandomHash } from "services/internal/security";
import { RegisterBody } from ".";
import { newAccountConfirmationTemplate } from "views/new-account-confirmation";

export const processRegister = async (registerBody: RegisterBody): Promise<ConfirmationResponse> => {
   // Check if email and password are valid
   if (!registerBody.email)
      throw new GeneralError("Email cannot be blank");
   if (!registerBody.password)
      throw new GeneralError("Password cannot be blank");

   // Set email to all lowercase
   const email = registerBody.email.toLowerCase();

   const usersService = await UsersService.getInstance();
   const usersAuthService = await UserAuthService.getInstance();
   const oneTimeCodeService = await OneTimeCodeService.getInstance();

   // Check if a user already exists with this email
   const existingUser = await usersService.findUserByEmail(email);
   if (existingUser)
      throw new AlreadyExistsError();

   // Create a new user
   let user: WithId<User> = await usersService.create(registerBody.firstName, registerBody.lastName, email, registerBody.userClaims);

   // Create user auth
   try {
      await usersAuthService.create(user._id, registerBody.password);
   }
   catch (error) {
      // If this fails, we'll try to delete the user record
      await usersService.delete(user._id);
      throw error;
   }

   // Generate confirmation code and key
   const confirmationCode = generateConfirmationCode();
   const key = generateRandomHash();

   // Create one time code
   await oneTimeCodeService.create(user._id, key, confirmationCode, "emailVerification");

   // Send email verification with the confirmation code
   const html = newAccountConfirmationTemplate(confirmationCode.toString());
   await sendEmail(email, "Budgeter - verify your email", html);

   // If all goes well, we'll be here
   return { key }
}