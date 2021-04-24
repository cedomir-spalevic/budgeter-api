import { GeneralError } from "models/errors";
import { parsePhoneNumber } from "services/external/phoneNumber";
import { isValidEmail } from ".";

interface Input {
   email?: string | null;
   phoneNumber?: string | null;
}

export const validateEmailOrPhoneNumber = (input: Input): Input => {
   let email = input.email;
   let phoneNumber = input.phoneNumber;
   if (
      (!email && !phoneNumber) ||
      (email &&
         email.trim().length === 0 &&
         phoneNumber &&
         phoneNumber.trim().length === 0) ||
      (!email && phoneNumber && phoneNumber.trim().length === 0) ||
      (email && email.trim().length === 0 && !phoneNumber)
   )
      throw new GeneralError("An email or phone number must be provided");
   if (email) {
      if (email === null || email.trim().length === 0)
         throw new GeneralError("Email cannot be blank");
      if (!isValidEmail(email)) throw new GeneralError("Email is not valid");
      email = email.toLowerCase().trim();
   }
   if (phoneNumber) {
      if (phoneNumber === null || phoneNumber.trim().length === 0)
         throw new GeneralError("Phone number cannot be blank");
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      if (!parsedPhoneNumber.isValid)
         throw new GeneralError("Phone number is not valid");
      phoneNumber = parsedPhoneNumber.internationalFormat;
   }
   if (!email) email = null;
   if (!phoneNumber) phoneNumber = null;
   return { email, phoneNumber };
};
