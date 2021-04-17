import { OneTimeCodeType } from "models/data/oneTimeCode";
import { getNewUserVerificationSmsMessage } from "./newUserVerification";
import { getPasswordResetVerificationSmsMessage } from "./passwordReset";
import { getUserVerificationSmsMessage } from "./userVerification";

export const getSmsMessage = (type: OneTimeCodeType, code: string): string => {
   let smsMessage: string;
   if(type === "newUserVerification") {
      smsMessage = getNewUserVerificationSmsMessage(code);
   } else if(type === "userVerification") {
      smsMessage = getUserVerificationSmsMessage(code);
   } else {
      smsMessage = getPasswordResetVerificationSmsMessage(code);
   }
   return smsMessage;
}