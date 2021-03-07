import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { getPathParameter } from "middleware/url";
import { isBool, isStr, isValidJSONBody } from "middleware/validators";
import { AdminUserRequest } from "models/requests";
import { ObjectId } from "mongodb";
import { processUpdateUser } from "./processor";

export interface AdminUpdateUserRequestBody {
   userId: ObjectId;
   userRequest: AdminUserRequest;
}

const validator = async (event: APIGatewayProxyEvent): Promise<AdminUpdateUserRequestBody> => {
   const adminId = await isAdminAuthorized(event);
   const userId = getPathParameter("userId", event.pathParameters);
   const form = isValidJSONBody(event.body);
   const firstName = isStr(form, "firstName");
   const lastName = isStr(form, "lastName");
   const isAdmin = isBool(form, "isAdmin");
   const password = isStr(form, "password");

   return {
      userId,
      userRequest: {
         firstName,
         lastName,
         isAdmin,
         password
      }
   }
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      const userRequest = await validator(event);
      const response = await processUpdateUser(userRequest);
      return {
         statusCode: 200,
         body: JSON.stringify(response),
         headers: {
            "Access-Control-Allow-Origin": "*"
         }
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}