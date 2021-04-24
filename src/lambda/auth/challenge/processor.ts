import { NotFoundError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import BudgeterMongoClient from "services/external/mongodb/client";
import { sendVerification } from "services/internal/verification";
import { User } from "models/data/user";
import { ChallengeBody } from "./validator";

export const processChallenge = async (
   challengeBody: ChallengeBody
): Promise<ConfirmationResponse> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();

   // Check if there exists a user with the given email address OR phone number
   const user = await usersService.find({
      $or: [
         {
            $and: [{ email: { $ne: null } }, { email: challengeBody.email }]
         },
         {
            $and: [
               { phoneNumber: { $ne: null } },
               { phoneNumber: challengeBody.phoneNumber }
            ]
         }
      ]
   });
   if (!user) {
      throw new NotFoundError(
         `No user found with the provided ${
            challengeBody.email ? "email" : "phone number"
         }`
      );
   }

   // The type field (ideally will entirely be controlled by the mobile app)
   // should tell us what type of email we will be sending.
   // All the templates are stored in src/views folder
   const userToChallenge: Partial<User> = {
      _id: user._id,
      email: challengeBody.email,
      phoneNumber: challengeBody.phoneNumber
   };
   const confirmationResponse = await sendVerification(
      userToChallenge,
      challengeBody.type
   );

   return {
      expires: confirmationResponse.expires,
      key: confirmationResponse.key
   };
};
