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
   const requestFormBody = JSON.parse(event.body);
   const paymentId = requestFormBody["paymentId"];
   // Check if budget id and payment id exist in the request
   if (!budgetId) {
      return {
         statusCode: 400,
         body: "Budget Id is invalid"
      };
   }
   if (!paymentId) {
      return {
         statusCode: 400,
         body: "Payment Id is required in the body"
      };
   }

   // Create budget payment
   try {
      const budgetPaymentsService = new BudgetPaymentsService(userId);
      await budgetPaymentsService.create(budgetId, paymentId);
      return {
         statusCode: 201,
         body: ""
      }
   }
   catch (error) {
      return {
         statusCode: 400,
         body: "Unable to create budget payment"
      };
   }
}