import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { isBool, isStr, isValidJSONBody } from "middleware/validators";
import { AdminUserRequest } from "models/requests";
import { processCreateUser } from "./processor";

const validator = async (
   event: APIGatewayProxyEvent
): Promise<AdminUserRequest> => {
   await isAdminAuthorized(event);
   const form = isValidJSONBody(event.body);
   const firstName = isStr(form, "firstName", true);
   const lastName = isStr(form, "lastName", true);
   const email = isStr(form, "email", true);
   const isAdmin = isBool(form, "isAdmin", true);
   const password = isStr(form, "password", true);

   return {
      firstName,
      lastName,
      email,
      isAdmin,
      password,
   };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const userBody = await validator(event);
      const response = await processCreateUser(userBody);
      return {
         statusCode: 200,
         body: JSON.stringify(response),
         headers: {
            "Access-Control-Allow-Origin": "*",
         },
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
