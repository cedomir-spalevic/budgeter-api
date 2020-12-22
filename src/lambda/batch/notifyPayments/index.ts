import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { processPaymentNotifications } from "./processor";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      await processPaymentNotifications();
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: JSON.stringify(error)
      }
   }
}