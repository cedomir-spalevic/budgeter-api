import { ConfirmationResponse } from "models/responses";
import { ObjectId } from "mongodb";

export interface IVerification {
   sendVerification(userId: ObjectId, emailOrPhoneNumber: string): Promise<ConfirmationResponse>
}