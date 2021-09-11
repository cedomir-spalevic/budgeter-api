/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Validator } from "jsonschema";
import { ValidationError } from "models/errors";

const validator = new Validator();

export const runValidation = (request: any, schema: Schema): void => {
   const result = validator.validate(request, schema, { nestedErrors: true });
   if (result.errors.length > 0) {
      const errors = new Set<string>();
      result.errors.forEach((error) => {
         if (error.name !== "anyOf" && error.name !== "oneOf") {
            errors.add(error.message);
         }
      });
      throw new ValidationError(Array.from(errors));
   }
};
