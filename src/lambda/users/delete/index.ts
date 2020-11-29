import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAdminAuthorized } from "middleware/auth";
import { User } from "models/data";
import BudgetPaymentsService from "services/db/budgetPayments";
import BudgetsService from "services/db/budgets";
import DevicesService from "services/db/device";
import PaymentsService from "services/db/payments";
import UsersAuthService from "services/db/userAuth";
import UsersService, { UserClaims } from "services/db/users";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {
      await isAdminAuthorized(event);
   }
   catch (event) {
      return {
         statusCode: 401,
         body: ""
      };
   }

   const userId = event.pathParameters["userId"];
   if (!userId) {
      return {
         statusCode: 400,
         body: "User Id is invalid"
      };
   }

   try {
      const devicesService = new DevicesService();
      await devicesService.deleteDevice(userId);
      const usersAuthService = new UsersAuthService();
      await usersAuthService.deleteUserAuth(userId);
      const paymentsService = new PaymentsService(userId);
      await paymentsService.deleteAllPayments();
      const budgetsService = new BudgetsService(userId);
      await budgetsService.deleteAllBudgets();
      const budgetPaymentsService = new BudgetPaymentsService(userId);
      await budgetPaymentsService.deleteAllBudgetPayments();
      const usersService = new UsersService();
      await usersService.delete(userId);
      return {
         statusCode: 200,
         body: ""
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: "Unable to delete User"
      }
   }
}