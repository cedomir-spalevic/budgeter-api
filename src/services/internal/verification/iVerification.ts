import { OneTimeCodeType } from "models/schemas/oneTimeCode";
import { ConfirmationResponse } from "models/responses";
import { ObjectId } from "mongodb";

export interface IVerification {
   sendVerification(
      userId: ObjectId,
      emailOrPhoneNumber: string,
      type: OneTimeCodeType
   ): Promise<ConfirmationResponse>;
}
