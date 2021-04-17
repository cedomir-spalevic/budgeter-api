import { OneTimeCodeType } from "models/data/oneTimeCode";
import { IEmailView } from "./iEmailView";
import { getNewUserVerificationEmailView } from "./newUserVerification";
import { getPasswordResetEmailView } from "./passwordReset";
import { getUserVerificationEmailView } from "./userVerification";

export const getEmailView = (type: OneTimeCodeType, code: string): IEmailView => {
   let emailView: IEmailView;
   if(type === "newUserVerification") {
      emailView = getNewUserVerificationEmailView(code);
   } else if(type === "userVerification") {
      emailView = getUserVerificationEmailView(code);
   } else {
      emailView = getPasswordResetEmailView(code);
   }
   return emailView;
}