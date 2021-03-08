import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAPIKeyAuthorized } from "middleware/auth";
import { handleErrorResponse } from "middleware/errors";
import { processPaymentNotifications } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      console.log(event);
      await isAPIKeyAuthorized(event);
      await processPaymentNotifications();
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return handleErrorResponse(error);
   }
}