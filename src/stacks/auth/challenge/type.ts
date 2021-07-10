import { OneTimeCodeType } from "models/data/oneTimeCode";

export interface ChallengeRequest {
   email?: string;
   phoneNumber?: string;
   type: OneTimeCodeType;
}
