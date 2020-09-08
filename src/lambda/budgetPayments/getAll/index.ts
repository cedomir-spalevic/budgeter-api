import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
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

   const budgetId = event.pathParameters["budgetId"];
   // Check if budget id exist in the request
   if (!budgetId) {
      return {
         statusCode: 400,
         body: "Budget Id is invalid"
      };
   }

   // Get all payments for budget
   try {
      const budgetPaymentsService = new BudgetPaymentsService(userId);
      const budgetPayments = await budgetPaymentsService.getAll(budgetId);
      return {
         statusCode: 200,
         body: JSON.stringify(budgetPayments)
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: "Unable to get budget payments"
      };
   }
}