import { OneTimeCodeType } from "models/schemas/oneTimeCode";
import { User } from "models/schemas/user";
import { ConfirmationResponse } from "models/responses";
import EmailVerification from "./email";
import { IVerification } from "./iVerification";
import PhoneNumberVerification from "./phoneNumber";

// Send a one time code verification to a user depending on if they have email or phone number populated
export const sendVerification = (
   user: Partial<User>,
   type: OneTimeCodeType
): Promise<ConfirmationResponse> => {
   let verification: IVerification;
   let emailOrPhone: string;
   if (user.email) {
      verification = new EmailVerification();
      emailOrPhone = user.email;
   }
   else if (user.phoneNumber) {
      verification = new PhoneNumberVerification();
      emailOrPhone = user.phoneNumber;
   }
   return verification.sendVerification(user._id, emailOrPhone, type);
};
