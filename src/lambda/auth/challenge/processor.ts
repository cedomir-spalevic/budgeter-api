import { GeneralError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import { ChallengeBody } from ".";
import { sendEmail } from "services/external/aws/ses";
import { getEmailConfirmationCodeView } from "views/email-confirmation-code";
import { getPasswordResetView } from "views/password-reset";
import { isValidEmail } from "middleware/validators";
import BudgeterMongoClient from "services/external/mongodb/client";
import {
   generateOneTimeCode,
   generateRandomOneTimeCode
} from "services/internal/security/oneTimeCode";

export const processChallenge = async (
   challengeBody: ChallengeBody
): Promise<ConfirmationResponse> => {
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();
   const usersService = budgeterClient.getUsersCollection();

   // Check if there exists a user with the given email address OR phone number
   // If the user does not exist and a VALID email was provided, then we want to return a fake key and expiration time
   // That way we're not exactly presenting whether or not a users email exists to a possible social engineering attack
   const user = await usersService.find({ email: challengeBody.email });
   if (!user) {
      const validEmail = isValidEmail(challengeBody.email);
      if (!validEmail) throw new GeneralError("Email is not valid");
      const randomOneTimeCode = generateRandomOneTimeCode();
      return {
         expires: randomOneTimeCode.expires,
         key: randomOneTimeCode.key
      };
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
