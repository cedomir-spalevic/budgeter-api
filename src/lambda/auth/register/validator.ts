import { Form } from "models/requests";
import { isStr } from "middleware/validators";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";

export interface RegisterBody {
   firstName: string;
   lastName: string;
   email?: string;
   phoneNumber?: string;
   password: string;
}

export const validate = (form: Form): RegisterBody => {
   const firstName = isStr(form, "firstName", true);
   const lastName = isStr(form, "lastName", true);
   const emailInput = isStr(form, "email");
   const phoneNumberInput = isStr(form, "phoneNumber");
   const password = isStr(form, "password", true);
   const { email, phoneNumber } = validateEmailOrPhoneNumber({ email: emailInput, phoneNumber: phoneNumberInput });

   return {
      firstName,
      lastName,
      email,
      phoneNumber,
      password
   };
};