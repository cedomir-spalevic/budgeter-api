import { ConfirmationResponse } from "models/responses";
import { ObjectId } from "mongodb";
import { generateOneTimeCode } from "services/internal/security/oneTimeCode";
import { IVerification } from "./iVerification";
import BudgeterMongoClient from "services/external/mongodb/client";
import { sendTextMessage } from "services/external/aws/sns";
import { OneTimeCodeType } from "models/data/oneTimeCode";
import { getSmsMessage } from "views/sms";

class PhoneNumberVerification implements IVerification {
   async sendVerification(userId: ObjectId, phoneNumber: string, type: OneTimeCodeType): Promise<ConfirmationResponse> {
      const budgeterClient = await BudgeterMongoClient.getInstance();
      const oneTimeCodeService = budgeterClient.getOneTimeCodeCollection();

      const oneTimeCode = generateOneTimeCode(userId, type);
      const code = oneTimeCode.code.code.toString();
      await oneTimeCodeService.create(oneTimeCode.code);
      
      const smsMessage = getSmsMessage(type, code);
      await sendTextMessage(phoneNumber, smsMessage);

      return {
         key: oneTimeCode.code.key,
         expires: oneTimeCode.expires
      }
   }

}

export default PhoneNumberVerification;