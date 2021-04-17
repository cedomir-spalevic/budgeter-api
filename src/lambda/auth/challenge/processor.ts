import { NotFoundError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import { ChallengeBody } from ".";
import { sendEmail } from "services/external/aws/ses";
import { getEmailConfirmationCodeView } from "views/email-confirmation-code";
import { getPasswordResetView } from "views/password-reset";
import BudgeterMongoClient from "services/external/mongodb/client";
import {
   generateOneTimeCode
} from "services/internal/security/oneTimeCode";

export const processChallenge = async (
   challengeBody: ChallengeBody
): Promise<ConfirmationResponse> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();
   const usersService = budgeterClient.getUsersCollection();

   // Check if there exists a user with the given email address OR phone number
   const user = await usersService.find({ 
      "$or" : [
         { 
            "$and": [
               { email: { "$ne": null } },
               { email: challengeBody.email }
            ]
         },
         { 
            "$and": [
               { phoneNumber: { "$ne": null } },
               { phoneNumber: challengeBody.phoneNumber }
            ]
         }
      ]
   });
   if (!user) {
      throw new NotFoundError(`No user found with the provided ${(challengeBody.email ? "email" : "phone number")}`);
   }

   const oneTimeCode = generateOneTimeCode(user._id, challengeBody.type);
   await oneTimeCodeService.create(oneTimeCode.code);

   // Type type field (ideally will entirely be controlled by the mobile app)
   // should tell us what type of email we will be sending.
   // All the templates are stored in src/views folder
   if (challengeBody.type === "emailVerification") {
      const emailConfirmationCodeView = getEmailConfirmationCodeView(
         oneTimeCode.code.code.toString()
      );
      await sendEmail(
         challengeBody.email,
         "Budgeter - your confirmation code",
         emailConfirmationCodeView
      );
   } else if (challengeBody.type === "passwordReset") {
      const passwordResetView = getPasswordResetView(
         oneTimeCode.code.code.toString()
      );
      await sendEmail(
         challengeBody.email,
         "Budgeter - reset your password",
         passwordResetView
      );
   }

   return {
      expires: oneTimeCode.expires,
      key: oneTimeCode.code.key
   };
};
