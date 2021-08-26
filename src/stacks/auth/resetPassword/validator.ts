import { BudgeterRequest } from "middleware/handler/lambda";
import { PasswordResetRequest } from "./type";
import { Validator } from "jsonschema";
import schema from "./schema.json";

const validator = new Validator();

export const validate = (request: BudgeterRequest): PasswordResetRequest => {
   const { pathParameters, body } = request;
   const input = { ...pathParameters, ...body };
   validator.validate(input, schema, { throwError: true });

   return { 
      key: body["key"] as string, 
      password: body["password"] as string 
   };
};
