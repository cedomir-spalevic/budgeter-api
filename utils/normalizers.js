import glibPhoneNumber from "libphonenumber-js";

export const normalizeStr = (str) => str.toLowerCase().trim();

export const normalizePhoneNumber = (phoneNumber) => {
   const parsedNumber = glibPhoneNumber(phoneNumber, "US");
   return parsedNumber.formatInternational();
};