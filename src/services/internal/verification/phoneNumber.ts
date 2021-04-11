import { ConfirmationResponse } from "models/responses";
import { ObjectId } from "mongodb";
import { generateOneTimeCode } from "services/internal/security/oneTimeCode";
import { IVerification } from "./iVerification";
import BudgeterMongoClient from "services/external/mongodb/client";
import { sendTextMessage } from "services/external/aws/sns";

class PhoneNumberVerification implements IVerification {
   async sendVerification(userId: ObjectId, phoneNumber: string): Promise<ConfirmationResponse> {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();

      const oneTimeCode = generateOneTimeCode(userId, "phoneNumberVerification");
      await oneTimeCodeService.create(oneTimeCode.code);

      const message = `${oneTimeCode.code.code.toString()} is your Budgeter confirmation code`;
      await sendTextMessage(phoneNumber, message);

      return {
         key: oneTimeCode.code.key,
         expires: oneTimeCode.expires
      }
   }

}

export default PhoneNumberVerification;