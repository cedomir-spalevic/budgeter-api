import { GeneralError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import UsersService from "services/external/mongodb/users";
import OneTimeCodeService from "services/external/mongodb/otc";
import { generateConfirmationCode, generateRandomHash } from "services/internal/security";
import { ChallengeBody } from ".";
import { sendEmail } from "services/external/aws/ses";
import { emailConfirmationCodeTemplate } from "views/email-confirmation-code";
import { passwordResetTemplate } from "views/password-reset";
import { isValidEmail } from "middleware/validators";

export const processChallenge = async (challengeBody: ChallengeBody): Promise<ConfirmationResponse> => {
   // Check if email is valid
   if (!challengeBody.email)
      throw new GeneralError("Email cannot be blank");

   // Set email to all lowercase
   const email = challengeBody.email.toLowerCase();

   const usersService = await UsersService.getInstance();
   const oneTimeCodeService = await OneTimeCodeService.getInstance();

   // Look for a user with this email address
   const user = await usersService.findUserByEmail(email);
   if (!user) {
      // If no user exists then we run a regex on an email
      const validEmail = isValidEmail(email);
      if (!validEmail)
         throw new GeneralError("Email is not valid");
      // If the email is valid, then return random key
      return { key: generateRandomHash() };
   }

   // Generate confirmation code and key
   const confirmationCode = generateConfirmationCode();
   const key = generateRandomHash();

   // Create confirmation code record
   await oneTimeCodeService.create(user._id, key, confirmationCode, challengeBody.type);

   // send different emails depending on type
   if (challengeBody.type === "emailVerification") {
      const html = emailConfirmationCodeTemplate(confirmationCode.toString());
      await sendEmail(email, "Budgeter - your confirmation code", html);
   }
   else if (challengeBody.type === "passwordReset") {
      const html = passwordResetTemplate(confirmationCode.toString());
      await sendEmail(email, "Budgeter - reset your password", html);
   }

   // If all goes well, we'll be here
   return { key }
}