import { getPathParameter } from "middleware/url";
import { validateBool, validateStr } from "middleware/validators";
import { GeneralError } from "models/errors";
import { AdminUserRequest, BudgeterRequest } from "models/requests";

export const validate = (request: BudgeterRequest): AdminUserRequest => {
   const { body } = request;
   const userId = getPathParameter("userId", request.pathParameters);
   const firstName = validateStr(body, "firstName");
   const lastName = validateStr(body, "lastName");
   const isAdmin = validateBool(body, "isAdmin");
   const password = validateStr(body, "password");
   if (password === "") throw new GeneralError("password is required");

   return {
      userId: userId,
      firstName,
      lastName,
      isAdmin,
      password
   };
};
