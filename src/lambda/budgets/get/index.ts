import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import BudgetsService from "services/external/db/budgets";
import BudgetPaymentsService from "services/external/db/budgetPayments";

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

   // Get budgets
   try {
      const budgetPaymentsService = new BudgetPaymentsService(userId);
      const budgetsService = new BudgetsService(userId);
      let budgets = await budgetsService.get();
      budgets = await Promise.all((await budgets).map(async x => {
         x.payments = await budgetPaymentsService.getAll(x.budgetId);
         return x;
      }));
      return {
         statusCode: 200,
         body: JSON.stringify(budgets)
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: "Unable to get budget"
      };
   }
}