import { NotFoundError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import BudgeterMongoClient from "services/external/mongodb/client";
import { sendVerification } from "services/internal/verification";
import { User } from "models/data/user";
import { ChallengeRequest } from "./type";

export const processChallenge = async (
   request: ChallengeRequest
): Promise<ConfirmationResponse> => {
   const { email, phoneNumber, type } = request;
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const usersService = budgeterClient.getUsersCollection();

   // Check if there exists a user with the given email address OR phone number
   const user = await usersService.find({
      $or: [
         {
            $and: [{ email: { $ne: null } }, { email: email }]
         },
         {
            $and: [{ phoneNumber: { $ne: null } }, { phoneNumber: phoneNumber }]
         }
      ]
   });
   if (!user) {
      throw new NotFoundError(
         `No user found with the provided ${email ? "email" : "phone number"}`
      );
   }

   // The type field (ideally will entirely be controlled by the mobile app)
   // should tell us what type of email we will be sending.
   // All the templates are stored in src/views folder
   const userToChallenge: Partial<User> = {
      _id: user._id,
      email: email,
      phoneNumber: phoneNumber
   };
   const confirmationResponse = await sendVerification(userToChallenge, type);

   return {
      expires: confirmationResponse.expires,
      key: confirmationResponse.key
   };
};
