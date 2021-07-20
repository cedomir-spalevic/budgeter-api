import { AlreadyExistsError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import BudgeterMongoClient from "services/external/mongodb/client";
import { User } from "models/schemas/user";
import { UserAuth } from "models/schemas/userAuth";
import { generateHash } from "services/internal/security/hash";
import { sendVerification } from "services/internal/verification";
import { RegisterBody } from "./validator";

export const processRegister = async (
   registerBody: RegisterBody
): Promise<ConfirmationResponse> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersAuthService = budgeterClient.getUsersAuthCollection();
   const usersService = budgeterClient.getUsersCollection();

   const existingUser = await usersService.find({
      $or: [
         {
            $and: [{ email: { $ne: null } }, { email: registerBody.email }]
         },
         {
            $and: [
               { phoneNumber: { $ne: null } },
               { phoneNumber: registerBody.phoneNumber }
            ]
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
   return sendVerification(user, "newUserVerification");
};