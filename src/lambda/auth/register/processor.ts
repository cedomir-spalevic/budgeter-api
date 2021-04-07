import { AlreadyExistsError, GeneralError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import { sendEmail } from "services/external/aws/ses";
import { RegisterBody } from ".";
import { getNewAccountConfirmationView } from "views/new-account-confirmation";
import BudgeterMongoClient from "services/external/mongodb/client";
import { User } from "models/data/user";
import { UserAuth } from "models/data/userAuth";
import { generateHash } from "services/internal/security/hash";
import { generateOneTimeCode } from "services/internal/security/oneTimeCode";

export const processRegister = async (
   registerBody: RegisterBody
): Promise<ConfirmationResponse> => {
   if (!registerBody.email) throw new GeneralError("Email cannot be blank");
   if (!registerBody.password)
      throw new GeneralError("Password cannot be blank");

   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const usersService = budgeterClient.getUsersCollection();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();

   const email = registerBody.email.toLowerCase();

   const existingUser = await usersService.find({ email });
   if (existingUser) throw new AlreadyExistsError();

   const newUser: Partial<User> = {
      firstName: registerBody.firstName,
      lastName: registerBody.lastName,
      email: email,
      isAdmin: false,
      isEmailVerified: false,
      notificationPreferences: {
         incomeNotifications: false,
         paymentNotifications: false
      }
   };
   const user = await usersService.create(newUser);

   try {
      const userAuth: Partial<UserAuth> = {
         userId: user._id,
         hash: generateHash(registerBody.password)
      };
      await usersAuthService.create(userAuth);
   } catch (error) {
      await usersService.delete(user._id);
      throw error;
   }

   // We are going to send the user an email with the generated one time code
   // If the user gets the email, then there will be a request for verification
   // in the challengeConfirmation endpoint
   const result = generateOneTimeCode(user._id, "emailVerification");
   await oneTimeCodeService.create(result.code);

   const accountConfirmationView = getNewAccountConfirmationView(
      result.code.code.toString()
   );
   await sendEmail(
      email,
      "Budgeter - verify your email",
      accountConfirmationView
   );

   return {
      expires: result.expires,
      key: result.code.key
   };
};
