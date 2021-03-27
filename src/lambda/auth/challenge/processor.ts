import { GeneralError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import { ChallengeBody } from ".";
import { sendEmail } from "services/external/aws/ses";
import { emailConfirmationCodeTemplate } from "views/email-confirmation-code";
import { passwordResetTemplate } from "views/password-reset";
import { isValidEmail } from "middleware/validators";
import BudgeterMongoClient from "services/external/mongodb/client";
import {
   generateOneTimeCode,
   generateRandomOneTimeCode
} from "services/internal/security/oneTimeCode";

export const processChallenge = async (
   challengeBody: ChallengeBody
): Promise<ConfirmationResponse> => {
   if (!challengeBody.email) throw new GeneralError("Email cannot be blank");

   const email = challengeBody.email.toLowerCase();
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();
   const usersService = budgeterClient.getUsersCollection();

   // Check if there exists a user with the given email address
   // If the user does not exist and a VALID email was provided, then we want to return a fake key and expiration time
   // That way we're not exactly presenting whether or not a users email exists to a possible social engineering attack
   const user = await usersService.find({ email });
   if (!user) {
      const validEmail = isValidEmail(email);
      if (!validEmail) throw new GeneralError("Email is not valid");
      const randomKey = generateRandomOneTimeCode();
      return {
         expires: randomKey.expires,
         key: randomKey.key
      };
   }

   const result = generateOneTimeCode(user._id, challengeBody.type);
   await oneTimeCodeService.create(result.code);

   // Type type field (ideally will entirely be controlled by the mobile app)
   // should tell us what type of email we will be sending.
   // All the templates are stored in src/views folder
   if (challengeBody.type === "emailVerification") {
      const html = emailConfirmationCodeTemplate(result.code.code.toString());
      await sendEmail(email, "Budgeter - your confirmation code", html);
   } else if (challengeBody.type === "passwordReset") {
      const html = passwordResetTemplate(result.code.code.toString());
      await sendEmail(email, "Budgeter - reset your password", html);
   }

   return {
      expires: result.expires,
      key: result.code.key
   };
};
