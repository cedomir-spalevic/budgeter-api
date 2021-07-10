import { BudgeterRequest } from "middleware/handler";
import { getPathParameterId } from "middleware/url";
import { validateStr } from "middleware/validators";
import { PasswordResetRequest } from "./type";

export const validate = (request: BudgeterRequest): PasswordResetRequest => {
   const { pathParameters, body } = request;
   const key = getPathParameterId("key", pathParameters);
   const password = validateStr(body, "password", true);

   return { key, password };
};
