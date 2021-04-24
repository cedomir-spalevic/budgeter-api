import { GeneralError, InvalidJSONBodyError } from "models/errors";
import { ObjectId } from "mongodb";
import { isISOStr } from "services/internal/datetime";
import { isValidPhoneNumber as glibIsValidPhoneNumber } from "libphonenumber-js";
import { Form } from "models/requests";
import { validate as validateGuid } from "uuid";

export const isNumber = (
   form: Form,
   name: string,
   required = false
): number => {
   if (required) {
      if (!(name in form)) throw new GeneralError(`${name} is required`);
      if (typeof form[name] !== "number")
         throw new GeneralError(`${name} must be a number`);
   } else {
      if (form[name] && typeof form[name] !== "number")
         throw new GeneralError(`${name} must be a number`);
   }
   return form[name] as number;
};

export const isStr = (form: Form, name: string, required = false): string => {
   if (required) {
      if (!(name in form)) throw new GeneralError(`${name} is required`);
      if (typeof form[name] !== "string")
         throw new GeneralError(`${name} must be a string`);
   } else {
      if (form[name] && typeof form[name] !== "string")
         throw new GeneralError(`${name} must be a string`);
   }
   return form[name] as string;
};

export const isOneOfStr = (
   form: Form,
   name: string,
   oneOfValues: string[],
   required = false
): string => {
   const value = isStr(form, name, required);
   if (required) {
      if (oneOfValues.indexOf(value) === -1)
         throw new GeneralError(
            `${name} must have a value of ${oneOfValues
               .map((x) => `'${x}'`)
               .join(" or ")}`
         );
   } else {
      if (value && oneOfValues.indexOf(value) === -1)
         throw new GeneralError(
            `${name} must have a value of ${oneOfValues
               .map((x) => `'${x}'`)
               .join(" or ")}`
         );
   }
   return value;
};

export const isId = (form: Form, name: string, required = false): ObjectId => {
   const id = isStr(form, name, required);
   if (required) {
      if (!id) throw new GeneralError(`${name} is required`);
      if (!ObjectId.isValid(id)) throw new GeneralError(`${name} is not valid`);
   } else {
      if (id && !ObjectId.isValid(id))
         throw new GeneralError(`${name} is not valid`);
   }
   return new ObjectId(id);
};

export const isDate = (form: Form, name: string, required = false): Date => {
   const date = isStr(form, name, required);
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

export const isBool = (form: Form, name: string, required = false): boolean => {
   if (required) {
      if (!(name in form)) throw new GeneralError(`${name} is required`);
      if (typeof form[name] !== "boolean")
         throw new GeneralError(`${name} must be a boolean`);
   } else {
      if (form[name] && typeof form[name] !== "boolean")
         throw new GeneralError(`${name} must be a boolean`);
   }
   return form[name] as boolean;
};

export const isValidJSONBody = (value: string): Form => {
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

export const isGuid = (guid: string): string => {
   const result = validateGuid(guid);
   if(!result)
      throw new GeneralError("Invalid Id");
   return guid;
}