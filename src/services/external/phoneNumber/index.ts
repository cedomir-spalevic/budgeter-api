import glibPhoneNumber from "libphonenumber-js";
import { ParsedPhoneNumber } from "./types";

export const parsePhoneNumber = (phoneNumber: string): ParsedPhoneNumber => {
   const parsedNumber = glibPhoneNumber(phoneNumber, "US");
   const isValid = parsedNumber.isValid();
   let internationalFormat = phoneNumber;
   if (isValid)
      internationalFormat = parsedNumber.formatInternational().replace(" ", "");
   return {
      internationalFormat,
      isValid
   };
};
