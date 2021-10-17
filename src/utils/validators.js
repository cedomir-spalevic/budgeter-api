import { isValidPhoneNumber } from "libphonenumber-js";

export const isEmail = (email) => {
   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email.toLowerCase());
};

export const isPhoneNumber = (phoneNumber) => {
   return isValidPhoneNumber(phoneNumber, "US");
};