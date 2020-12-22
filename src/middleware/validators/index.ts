import { GeneralError, InvalidJSONBodyError } from "models/errors";
import { ObjectId } from "mongodb";
import { isISOStr } from "services/internal/datetime";

interface Form {
   [name: string]: any;
}

export const isNumber = (form: Form, name: string, required: boolean = false): number => {
   if (required) {
      if (!(name in form))
         throw new GeneralError(`${name} is required`);
      if (typeof (form[name]) !== "number")
         throw new GeneralError(`${name} must be a number`);
   }
   else {
      if (form[name] && typeof (form[name]) !== "number")
         throw new GeneralError(`${name} must be a number`);
   }
   return form[name];
}

export const isStr = (form: Form, name: string, required: boolean = false): string => {
   if (required) {
      if (!(name in form))
         throw new GeneralError(`${name} is required`);
      if (typeof (form[name]) !== "string")
         throw new GeneralError(`${name} must be a string`);
   }
   else {
      if (form[name] && typeof (form[name]) !== "string")
         throw new GeneralError(`${name} must be a string`);
   }
   return form[name];
}

export const isId = (form: Form, name: string, required: boolean = false): ObjectId => {
   const id = isStr(form, name, required);
   if (required) {
      if (!id)
         throw new GeneralError(`${name} is required`);
      if (!ObjectId.isValid(id))
         throw new GeneralError(`${name} is not valid`);
   }
   else {
      if (id && !ObjectId.isValid(id))
         throw new GeneralError(`${name} is not valid`);
   }
   return new ObjectId(id);
}

export const isDate = (form: Form, name: string, required: boolean = false): Date => {
   const date = isStr(form, name, required);
   if (required) {
      if (!(name in form))
         throw new GeneralError(`${name} is required`);
      if (!isISOStr(date))
         throw new GeneralError(`${name} must be in ISO format`);
   }
   else {
      if (form[name] && !isISOStr(date))
         throw new GeneralError(`${name} must be in ISO format`);
   }
   return new Date(date);
}

export const isBool = (form: Form, name: string, required: boolean = false): boolean => {
   if (required) {
      if (!(name in form))
         throw new GeneralError(`${name} is required`);
      if (typeof (form[name]) !== "boolean")
         throw new GeneralError(`${name} must be a boolean`);
   }
   else {
      if (form[name] && typeof (form[name]) !== "boolean")
         throw new GeneralError(`${name} must be a boolean`);
   }
   return form[name];
}

export const isValidJSONBody = (value: string): Form => {
   if (!value)
      throw new InvalidJSONBodyError();
   const body = JSON.parse(value);
   if (!body)
      throw new InvalidJSONBodyError();
   return body;
}