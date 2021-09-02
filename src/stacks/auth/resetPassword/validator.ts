import { PasswordResetRequest } from "./type";
import { Validator } from "jsonschema";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";

const validator = new Validator();

export const validate = (request: BudgeterRequest): PasswordResetRequest => {
   const { pathParameters, body } = request;
   const input = { ...pathParameters, ...body };
   validator.validate(input, schema, { throwError: true });

   return {
      key: input["key"] as string,
      password: input["password"] as string
   };
};
