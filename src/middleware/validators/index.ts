import { GeneralError, InvalidJSONBodyError } from "models/errors";
import { ObjectId } from "mongodb";
import { isISOStr } from "services/internal/datetime";
import { isValidPhoneNumber as glibIsValidPhoneNumber } from "libphonenumber-js";
import { Form } from "models/requests";
import { validate as validateUuid } from "uuid";

export const validateNumber = (
   form: Form,
   name: string,
   required = false
): number => {
   if (required) {
      if (!(name in form)) throw new GeneralError(`${name} is required`);
      if (typeof form[name] !== "number")
         throw new GeneralError(`${name} must be a number`);
   } else {
      if (form[name] !== undefined && typeof form[name] !== "number")
         throw new GeneralError(`${name} must be a number`);
   }
   return form[name] as number;
};

export const validateStr = (
   form: Form,
   name: string,
   required = false
): string => {
   if (required) {
      if (!(name in form)) throw new GeneralError(`${name} is required`);
      if (typeof form[name] !== "string")
         throw new GeneralError(`${name} must be a string`);
   } else {
      if (form[name] !== undefined && typeof form[name] !== "string")
         throw new GeneralError(`${name} must be a string`);
   }
   return form[name] as string;
};

export const validateIsOneOfStr = (
   form: Form,
   name: string,
   oneOfValues: string[],
   required = false
): string => {
   const value = validateStr(form, name, required);
   if (required) {
      if (oneOfValues.indexOf(value) === -1)
         throw new GeneralError(
            `${name} must have a value of ${oneOfValues
               .map((x) => `'${x}'`)
               .join(" or ")}`
         );
   } else {
      if (value !== undefined && oneOfValues.indexOf(value) === -1)
         throw new GeneralError(
            `${name} must have a value of ${oneOfValues
               .map((x) => `'${x}'`)
               .join(" or ")}`
         );
   }
   return value;
};

export const validateObjectId = (
   form: Form,
   name: string,
   required = false
): ObjectId => {
   const id = validateStr(form, name, required);
   if (required) {
      if (!id) throw new GeneralError(`${name} is required`);
      if (!ObjectId.isValid(id)) throw new GeneralError(`${name} is not valid`);
   } else {
      if (id && !ObjectId.isValid(id))
         throw new GeneralError(`${name} is not valid`);
   }
   return new ObjectId(id);
};

export const validateDate = (
   form: Form,
   name: string,
   required = false
): Date => {
   const date = validateStr(form, name, required);
   if (required) {
      if (!(name in form)) throw new GeneralError(`${name} is required`);
      if (!isISOStr(date))
         throw new GeneralError(`${name} must be in ISO format`);
   } else {
      if (form[name] && !isISOStr(date))
         throw new GeneralError(`${name} must be in ISO format`);
   }
   if (!form[name]) return undefined;
   return new Date(date);
};

export const validateBool = (
   form: Form,
   name: string,
   required = false
): boolean => {
   if (required) {
      if (!(name in form)) throw new GeneralError(`${name} is required`);
      if (typeof form[name] !== "boolean")
         throw new GeneralError(`${name} must be a boolean`);
   } else {
      if (form[name] !== undefined && typeof form[name] !== "boolean")
         throw new GeneralError(`${name} must be a boolean`);
   }
   return form[name] as boolean;
};

export const validateJSONBody = (value: string): Form => {
   if (!value) throw new InvalidJSONBodyError();
   const body = JSON.parse(value);
   if (!body) throw new InvalidJSONBodyError();
   return body;
};

export const isValidEmail = (email: string): boolean => {
   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email.toLowerCase());
};

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
   return glibIsValidPhoneNumber(phoneNumber, "US");
};

export const validateGuid = (guid: string): string => {
   const result = validateUuid(guid);
   if (!result) throw new GeneralError("Invalid Id");
   return guid;
};

export const validateDayOfWeek = (
   form: Form,
   name: string,
   required = false
): number => {
   const num = validateNumber(form, name, required);
   if (num < 0 || num > 6)
      throw new GeneralError(`${name} must be between 0 and 6`);
   return num;
};

export const validateDayOfMonth = (
   form: Form,
   name: string,
   required = false
): number => {
   const num = validateNumber(form, name, required);
   if (num < 1 || num > 31)
      throw new GeneralError(`${name} must be between 1 and 31`);
   return num;
};

export const validateMonth = (
   form: Form,
   name: string,
   required = false
): number => {
   const num = validateNumber(form, name, required);
   if (num < 0 || num > 11)
      throw new GeneralError(`${name} must be between 0 and 11`);
   return num;
};

export const validateYear = (
   form: Form,
   name: string,
   required = false
): number => {
   const num = validateNumber(form, name, required);
   if (!/^\d{4}$/.test(num.toString()))
      throw new GeneralError(`${name} is not valid`);
   return num;
};
