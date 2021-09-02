import { OneTimeCodeType } from "models/schemas/oneTimeCode";

export interface ChallengeRequest {
   email?: string;
   phoneNumber?: string;
   type: OneTimeCodeType;
}
