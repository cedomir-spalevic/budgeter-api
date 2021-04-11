import { AlreadyExistsError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import { RegisterBody } from ".";
import BudgeterMongoClient from "services/external/mongodb/client";
import { User } from "models/data/user";
import { UserAuth } from "models/data/userAuth";
import { generateHash } from "services/internal/security/hash";
import { IVerification } from "services/internal/verification/iVerification";
import EmailVerification from "services/internal/verification/email";
import PhoneNumberVerification from "services/internal/verification/phoneNumber";

export const processRegister = async (
   registerBody: RegisterBody
): Promise<ConfirmationResponse> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const usersService = budgeterClient.getUsersCollection();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();

   const existingUser = await usersService.find({
      $or: [
         {
            email: registerBody.email
         },
         {
            phoneNumber: registerBody.phoneNumber
         }
      ]
   });
   if (existingUser) throw new AlreadyExistsError();

   const newUser: Partial<User> = {
      firstName: registerBody.firstName,
      lastName: registerBody.lastName,
      email: registerBody.email,
      phoneNumber: registerBody.phoneNumber,
      isAdmin: false,
      isMfaVerified: false,
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

   // We are going to send the user an email or phone number with the generated one time code
   // If the user gets the message, then there will be a request for verification
   // in the challengeConfirmation endpoint
   let verification: IVerification;
   let emailOrPhone: string;
   if (user.email) {
      verification = new EmailVerification();
      emailOrPhone = user.email;
   }
   if (user.phoneNumber) {
      verification = new PhoneNumberVerification();
      emailOrPhone = user.phoneNumber;
   }
   return verification.sendVerification(user._id, emailOrPhone);
};
