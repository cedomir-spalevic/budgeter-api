import { BudgeterRequest } from "middleware/handler/lambda";
import { Validator } from "jsonschema";
import schema from "./schema.json";

const validator = new Validator();

export interface RegisterBody {
   firstName: string;
   lastName: string;
   email?: string;
   phoneNumber?: string;
   password: string;
}

export const validate = (request: BudgeterRequest): RegisterBody => {
   const { body } = request;
   validator.validate(body, schema, { throwError: true });

   return {
      firstName: body["firstName"] as string,
      lastName: body["lastName"] as string,
      email: body["email"] as string,
      phoneNumber: body["phoneNumber"] as string,
      password: body["password"] as string
   };
};
