import { Form } from "models/requests";
import { validateStr } from "middleware/validators";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";

export interface RegisterBody {
   firstName: string;
   lastName: string;
   email?: string;
   phoneNumber?: string;
   password: string;
}

export const validate = (form: Form): RegisterBody => {
   const firstName = validateStr(form, "firstName", true);
   const lastName = validateStr(form, "lastName", true);
   const emailInput = validateStr(form, "email");
   const phoneNumberInput = validateStr(form, "phoneNumber");
   const password = validateStr(form, "password", true);
   const { email, phoneNumber } = validateEmailOrPhoneNumber({
      email: emailInput,
      phoneNumber: phoneNumberInput
   });

   return {
      firstName,
      lastName,
      email,
      phoneNumber,
      password
   };
};
