import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import PaymentsService from "services/db/payments";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   let userId: string;
   try {
      userId = await isAuthorized(event);
   }
   catch (event) {
      return {
         statusCode: 401,
         body: ""
      };
   }

   // Get payments
   try {
      const paymentsService = new PaymentsService(userId);
      const payments = await paymentsService.get();
      return {
         statusCode: 200,
         body: JSON.stringify(payments)
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: "Unable to get payment"
      };
   }
}