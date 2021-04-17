import { ConfirmationResponse } from "models/responses";
import { ObjectId } from "mongodb";
import { generateOneTimeCode } from "services/internal/security/oneTimeCode";
import { IVerification } from "./iVerification";
import BudgeterMongoClient from "services/external/mongodb/client";
import { getNewAccountConfirmationView } from "views/new-account-confirmation";
import { sendEmail } from "services/external/aws/ses";
import { OneTimeCodeType } from "models/data/oneTimeCode";
import { getEmailConfirmationCodeView } from "views/email-confirmation-code";
import { getPasswordResetView } from "views/password-reset";

class EmailVerification implements IVerification {
   async sendVerification(userId: ObjectId, email: string, type: OneTimeCodeType): Promise<ConfirmationResponse> {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();

      const oneTimeCode = generateOneTimeCode(userId, type);
      const code = oneTimeCode.code.code.toString();
      await oneTimeCodeService.create(oneTimeCode.code);

      let view: string;
      let subject: string;
      if(type === "newUserVerification") {
         view = getNewAccountConfirmationView(code);
         subject = "Budgeter - verify your email";
      } else if(type === "userVerification") {
         view = getEmailConfirmationCodeView(code);
         subject = "Budgeter - your confirmation code";
      } else {
         view = getPasswordResetView(code);
         subject = "Budgeter - reset your password";
      }
      await sendEmail(
         email,
         subject,
         view
      );

      return {
         key: oneTimeCode.code.key,
         expires: oneTimeCode.expires
      }
   }

}

export default EmailVerification;