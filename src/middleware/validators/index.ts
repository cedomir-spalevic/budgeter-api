import { GeneralError, InvalidJSONBodyError } from "models/errors";

interface Form {
   [name: string]: string;
}

export const isNumber = (value: any): number => {
   return 0;
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

export const isDate = (value: any): Date => {
   return new Date();
}

export const isBool = (value: any): boolean => {
   return false;
}

export const isValidJSONBody = (value: string): Form => {
   if (!value)
      throw new InvalidJSONBodyError();
   const body = JSON.parse(value);
   if (!body)
      throw new InvalidJSONBodyError();
   return body;
}