import { Form } from "models/requests";
import { validateIsOneOfStr, validateStr } from "middleware/validators";
import { OneTimeCodeType } from "models/data/oneTimeCode";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";

export interface ChallengeBody {
   email?: string;
   phoneNumber?: string;
   type: OneTimeCodeType;
}

export const validate = (form: Form): ChallengeBody => {
   const type = validateIsOneOfStr(
      form,
      "type",
      ["userVerification", "passwordReset"],
      true
   ) as OneTimeCodeType;
   const emailInput = validateStr(form, "email");
   const phoneNumberInput = validateStr(form, "phoneNumber");
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
