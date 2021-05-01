import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import {
   validateBool,
   validateStr,
   validateJSONBody
} from "middleware/validators";
import { User } from "models/data/user";
import { processUpdateUser } from "./processor";

const validate = async (
   event: APIGatewayProxyEvent
): Promise<Partial<User>> => {
   const userId = await isAuthorized(event);
   const form = validateJSONBody(event.body);
   const firstName = validateStr(form, "firstName", false);
   const lastName = validateStr(form, "lastName", false);
   const incomeNotifications = validateBool(form, "incomeNotifications", false);
   const paymentNotifications = validateBool(
      form,
      "paymentNotifications",
      false
   );

   return {
      _id: userId,
      firstName: firstName,
      lastName: lastName,
      notificationPreferences: {
         incomeNotifications,
         paymentNotifications
      }
   };
};

export const handler = async (
   event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
   try {
      const partiallyUpdatedUser = await validate(event);
      const response = await processUpdateUser(partiallyUpdatedUser);
      return {
         statusCode: 200,
         body: JSON.stringify(response)
      };
   } catch (error) {
      return handleErrorResponse(error);
   }
};
