import { APIGatewayProxyEventPathParameters } from "aws-lambda";
import { getPathParameter } from "middleware/url";
import { validateBool, validateStr } from "middleware/validators";
import { GeneralError } from "models/errors";
import { AdminUserRequest, Form } from "models/requests";
import { ObjectId } from "mongodb";

export const validatePathParameter = (
   pathParameters: APIGatewayProxyEventPathParameters
): ObjectId => {
   return getPathParameter("userId", pathParameters);
};

export const validateForm = (form: Form): AdminUserRequest => {
   const firstName = validateStr(form, "firstName");
   const lastName = validateStr(form, "lastName");
   const isAdmin = validateBool(form, "isAdmin");
   const password = validateStr(form, "password");
   if (password === "") throw new GeneralError("password is required");

   return {
      firstName,
      lastName,
      isAdmin,
      password
   };
};
