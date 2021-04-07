import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { isBool, isStr, isValidJSONBody } from "middleware/validators";
import { User } from "models/data/user";
import { processUpdateUser } from "./processor";

const validate = async (
   event: APIGatewayProxyEvent
): Promise<Partial<User>> => {
   const userId = await isAuthorized(event);
   const form = isValidJSONBody(event.body);
   const firstName = isStr(form, "firstName", false);
   const lastName = isStr(form, "lastName", false);
   const incomeNotifications = isBool(form, "incomeNotifications", false);
   const paymentNotifications = isBool(form, "paymentNotifications", false);

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
