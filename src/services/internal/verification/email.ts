import { ConfirmationResponse } from "models/responses";
import { ObjectId } from "mongodb";
import { generateOneTimeCode } from "services/internal/security/oneTimeCode";
import { IVerification } from "./iVerification";
import BudgeterMongoClient from "services/external/mongodb/client";
import { getNewAccountConfirmationView } from "views/new-account-confirmation";
import { sendEmail } from "services/external/aws/ses";

class EmailVerification implements IVerification {
   async sendVerification(userId: ObjectId, email: string): Promise<ConfirmationResponse> {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();

      const oneTimeCode = generateOneTimeCode(userId, "emailVerification");
      await oneTimeCodeService.create(oneTimeCode.code);

      const accountConfirmationView = getNewAccountConfirmationView(
         oneTimeCode.code.code.toString()
      );
      await sendEmail(
         email,
         "Budgeter - verify your email",
         accountConfirmationView
      );

      return {
         key: oneTimeCode.code.key,
         expires: oneTimeCode.expires
      }
   }

}

export default EmailVerification;