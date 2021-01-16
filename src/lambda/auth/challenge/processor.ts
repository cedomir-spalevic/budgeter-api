import { GeneralError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import { ChallengeBody } from ".";
import { sendEmail } from "services/external/aws/ses";
import { emailConfirmationCodeTemplate } from "views/email-confirmation-code";
import { passwordResetTemplate } from "views/password-reset";
import { isValidEmail } from "middleware/validators";
import BudgeterMongoClient from "services/external/mongodb/client";
import { generateOneTimeCode, generateRandomKey } from "services/internal/security/oneTimeCode";

export const processChallenge = async (challengeBody: ChallengeBody): Promise<ConfirmationResponse> => {
   // Check if email is valid
   if (!challengeBody.email)
      throw new GeneralError("Email cannot be blank");

   // Get Mongo Client
   const budgeterClient = await BudgeterMongoClient.getInstance();
   const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();
   const usersService = budgeterClient.getUsersCollection();

   // Set email to all lowercase
   const email = challengeBody.email.toLowerCase();

   // Look for a user with this email address
   const user = await usersService.find({ email });
   if (!user) {
      // If no user exists then we run a regex on an email
      const validEmail = isValidEmail(email);
      if (!validEmail)
         throw new GeneralError("Email is not valid");

      // If the email is valid, then return random key
      const randomKey = generateRandomKey();
      return {
         expires: randomKey.expires,
         key: randomKey.key
      };
   }

   // Create OTC
   const result = generateOneTimeCode(user._id, challengeBody.type);
   await oneTimeCodeService.create(result.code);

   // Send different emails depending on type
   if (challengeBody.type === "emailVerification") {
      const html = emailConfirmationCodeTemplate(result.code.code.toString());
      await sendEmail(email, "Budgeter - your confirmation code", html);
   }
   else if (challengeBody.type === "passwordReset") {
      const html = passwordResetTemplate(result.code.code.toString());
      await sendEmail(email, "Budgeter - reset your password", html);
   }

   // Return OTC key identifier
   return {
      expires: result.expires,
      key: result.code.key
   }
}