import { LoginRequest } from "./type";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";
import { runValidation } from "services/internal/validation";

export const validate = (request: BudgeterRequest): LoginRequest => {
   const { body } = request;
   runValidation(body, schema);

   return {
      email: body["email"] as string,
      phoneNumber: body["phoneNumber"] as string,
      password: body["password"] as string
   };
};
