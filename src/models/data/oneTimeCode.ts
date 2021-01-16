import { ObjectId } from "mongodb";
import { IEntity } from "./ientity";

export type OneTimeCodeType = "emailVerification" | "passwordReset";

export interface OneTimeCode extends IEntity {
   userId: ObjectId;
   key: string;
   type: OneTimeCodeType;
   code: number;
   completed: boolean;
   expiresOn: number;
}