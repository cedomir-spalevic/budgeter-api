import { AlreadyExistsError, GeneralError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import { sendEmail } from "services/external/aws/ses";
import { RegisterBody } from ".";
import { newAccountConfirmationTemplate } from "views/new-account-confirmation";
import BudgeterMongoClient from "services/external/mongodb/client";
import { User } from "models/data/user";
import { UserAuth } from "models/data/userAuth";
import { generateHash } from "services/internal/security/hash";
import { generateOneTimeCode } from "services/internal/security/oneTimeCode";

export const processRegister = async (
   registerBody: RegisterBody
): Promise<ConfirmationResponse> => {
   // Check if email and password are valid
   if (!registerBody.email) throw new GeneralError("Email cannot be blank");
   if (!registerBody.password)
      throw new GeneralError("Password cannot be blank");

   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const usersService = budgeterClient.getUsersCollection();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();

   // Set email to all lowercase
   const email = registerBody.email.toLowerCase();

   // Check if a user already exists with this email
   const existingUser = await usersService.find({ email });
   if (existingUser) throw new AlreadyExistsError();

   // Create a new user
   const newUser: Partial<User> = {
      firstName: registerBody.firstName,
      lastName: registerBody.lastName,
      email: email,
      isAdmin: false,
      isEmailVerified: false,
      notificationPreferences: {
         incomeNotifications: false,
         paymentNotifications: false,
      },
   };
   const user = await usersService.create(newUser);

   // Create user auth
   try {
      const userAuth: Partial<UserAuth> = {
         userId: user._id,
         hash: generateHash(registerBody.password),
      };
      await usersAuthService.create(userAuth);
   } catch (error) {
      // If this fails, we'll try to delete the user record
      await usersService.delete(user._id);
      throw error;
   }

   // Create OTC
   const result = generateOneTimeCode(user._id, "emailVerification");
   await oneTimeCodeService.create(result.code);

   // Send email verification with the confirmation code
   const html = newAccountConfirmationTemplate(result.code.code.toString());
   await sendEmail(email, "Budgeter - verify your email", html);

   // Return Key identifier
   return {
      expires: result.expires,
      key: result.code.key,
   };
};
