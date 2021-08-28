import { LoginRequest } from "./type";
import { Validator } from "jsonschema";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";

const validator = new Validator();

export const validate = (request: BudgeterRequest): LoginRequest => {
   const { body } = request;
   validator.validate(body, schema, { throwError: true });

   return {
      email: body["email"] as string,
      phoneNumber: body["phoneNumber"] as string,
      password: body["password"] as string
   };
};
