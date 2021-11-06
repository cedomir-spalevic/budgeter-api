const glibPhoneNumber = require("libphonenumber-js");

const countryCode = "US";

module.exports.isPhoneNumber = (phoneNumber) =>
   glibPhoneNumber.isValidPhoneNumber(phoneNumber, countryCode);

module.exports.normalizePhoneNumber = (phoneNumber) => {
   const parsedNumber = glibPhoneNumber(phoneNumber, countryCode);
   return parsedNumber.formatInternational();
};
