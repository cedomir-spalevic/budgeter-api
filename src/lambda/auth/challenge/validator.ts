import { Form } from "models/requests";
import { isOneOfStr, isStr } from "middleware/validators";
import { OneTimeCodeType } from "models/data/oneTimeCode";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";

export interface ChallengeBody {
   email?: string;
   phoneNumber?: string;
   type: OneTimeCodeType;
}

export const validate = (form: Form): ChallengeBody => {
   const type = isOneOfStr(
      form,
      "type",
      ["userVerification", "passwordReset"],
      true
   ) as OneTimeCodeType;
   const emailInput = isStr(form, "email");
   const phoneNumberInput = isStr(form, "phoneNumber");
   const { email, phoneNumber } = validateEmailOrPhoneNumber({ email: emailInput, phoneNumber: phoneNumberInput });

   return {
      email,
      phoneNumber,
      type
   };
};