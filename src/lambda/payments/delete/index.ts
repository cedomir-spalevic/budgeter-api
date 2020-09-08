import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import PaymentsService from "services/db/payments";
import BudgetPaymentsService from "services/db/budgetPayments";

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

   const paymentId = event.pathParameters["paymentId"];
   if (!paymentId) {
      return {
         statusCode: 400,
         body: "Payment Id is invalid"
      };
   }

   // Delete payment
   try {
      const paymentsService = new PaymentsService(userId);
      await paymentsService.delete(paymentId);
      const budgetPaymentsService = new BudgetPaymentsService(userId);
      await budgetPaymentsService.removePaymentFromBudgets(paymentId);
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: "Unable to delete payment"
      };
   }
}