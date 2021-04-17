import { ConfirmationResponse } from "models/responses";
import { ObjectId } from "mongodb";
import { generateOneTimeCode } from "services/internal/security/oneTimeCode";
import { IVerification } from "./iVerification";
import BudgeterMongoClient from "services/external/mongodb/client";
import { sendEmail } from "services/external/aws/ses";
import { OneTimeCodeType } from "models/data/oneTimeCode";
import { IEmailView } from "views/emails/iEmailView";
import { getEmailView } from "views/emails";

class EmailVerification implements IVerification {
   async sendVerification(userId: ObjectId, email: string, type: OneTimeCodeType): Promise<ConfirmationResponse> {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();

      const oneTimeCode = generateOneTimeCode(userId, type);
      const code = oneTimeCode.code.code.toString();
      await oneTimeCodeService.create(oneTimeCode.code);

      const emailView: IEmailView = getEmailView(type, code);
      await sendEmail(
         email,
         emailView.subject,
         emailView.html
      );

      return {
         key: oneTimeCode.code.key,
         expires: oneTimeCode.expires
      }
   }

}

export default EmailVerification;