import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import {
   validateBool,
   validateStr,
   validateJSONBody
} from "middleware/validators";
import { AdminUserRequest } from "models/requests";
import { ObjectId } from "mongodb";
import { processUpdateUser } from "./processor";

export interface AdminUpdateUserRequestBody {
   userId: ObjectId;
   userRequest: AdminUserRequest;
}

const validate = async (
   event: APIGatewayProxyEvent
): Promise<AdminUpdateUserRequestBody> => {
   await isAdminAuthorized(event);
   const userId = getPathParameter("userId", event.pathParameters);
   const form = validateJSONBody(event.body);
   const firstName = validateStr(form, "firstName");
   const lastName = validateStr(form, "lastName");
   const isAdmin = validateBool(form, "isAdmin");
   const password = validateStr(form, "password");

   return {
      userId,
      userRequest: {
         firstName,
         lastName,
         isAdmin,
         password
      }
   };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const userRequest = await validate(event);
      const response = await processUpdateUser(userRequest);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
