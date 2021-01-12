import { GeneralError, NoUserEmailFoundError } from "models/errors";
import { ConfirmationResponse } from "models/responses";
import UsersService from "services/external/mongodb/users";
import ConfirmationCodesService from "services/external/mongodb/confirmationCodes";
import { generateConfirmationCode, generateRandomHash } from "services/internal/security";
import { ChallengeBody } from ".";
import { sendVerificationEmail } from "services/external/aws/ses";

export const processChallenge = async (challengeBody: ChallengeBody): Promise<ConfirmationResponse> => {
   // Check if email is valid
   if (!challengeBody.email)
      throw new GeneralError("Email cannot be blank");

   // Set email to all lowercase
   const email = challengeBody.email.toLowerCase();

   const usersService = await UsersService.getInstance();
   const confirmationCodesService = await ConfirmationCodesService.getInstance();

   // Look for a user with this email address
   const user = await usersService.findUserByEmail(email);
   if (!user)
      throw new NoUserEmailFoundError();

   // Generate confirmation code and key
   const confirmationCode = generateConfirmationCode();
   const key = generateRandomHash();

   // Create confirmation code record
   await confirmationCodesService.create(user._id, key, confirmationCode);

   // Send email verification with the confirmation code
   await sendVerificationEmail(email, confirmationCode.toString());

   // If all goes well, we'll be here
   return { key }
}