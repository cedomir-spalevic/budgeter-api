import glibPhoneNumber from "libphonenumber-js";

const countryCode = "US";

export const isPhoneNumber = (phoneNumber) => glibPhoneNumber.isValidPhoneNumber(phoneNumber, countryCode);

export const normalizePhoneNumber = (phoneNumber) => {
   const parsedNumber = glibPhoneNumber(phoneNumber, countryCode);
   return parsedNumber.formatInternational();
};