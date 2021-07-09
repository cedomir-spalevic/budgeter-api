import { validateIsOneOfStr, validateStr } from "middleware/validators";
import { OneTimeCodeType } from "models/data/oneTimeCode";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";
import { BudgeterRequest } from "middleware/handler";

export interface ChallengeBody {
   email?: string;
   phoneNumber?: string;
   type: OneTimeCodeType;
}

export const validate = (request: BudgeterRequest): ChallengeBody => {
   const { body } = request;
   const type = validateIsOneOfStr(
      body,
      "type",
      ["userVerification", "passwordReset"],
      true
   ) as OneTimeCodeType;
   const emailInput = validateStr(body, "email");
   const phoneNumberInput = validateStr(body, "phoneNumber");
   const { email, phoneNumber } = validateEmailOrPhoneNumber({
      email: emailInput,
      phoneNumber: phoneNumberInput
   });

   return {
      email,
      phoneNumber,
      type
   };
};
