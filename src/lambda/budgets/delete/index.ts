import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import BudgetPaymentsService from "services/db/budgetPayments";
import BudgetsService from "services/db/budgets";

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
   if (!budgetId) {
      return {
         statusCode: 400,
         body: "Budget Id is invalid"
      };
   }

   // Delete budget
   try {
      const budgetsService = new BudgetsService(userId);
      await budgetsService.delete(budgetId);
      const budgetPaymentsService = new BudgetPaymentsService(userId);
      await budgetPaymentsService.deleteAll(budgetId);
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: "Unable to delete budget"
      };
   }
}