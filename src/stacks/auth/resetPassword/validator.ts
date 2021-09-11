import { PasswordResetRequest } from "./type";
import schema from "./schema.json";
import { BudgeterRequest } from "models/requests";
import { runValidation } from "services/internal/validation";

export const validate = (request: BudgeterRequest): PasswordResetRequest => {
   const { pathParameters, body } = request;
   const input = { ...pathParameters, ...body };
   runValidation(input, schema);

   return {
      key: input["key"] as string,
      password: input["password"] as string
   };
};
