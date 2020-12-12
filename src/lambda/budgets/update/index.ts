import {
   APIGatewayProxyEvent,
   APIGatewayProxyResult
} from "aws-lambda";
import { isAuthorized } from "middleware/auth";
import { BudgetResponse } from "models/responses";
import BudgetsService from "services/external/db/budgets";

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

   const budgetResponse: BudgetResponse = {
      valid: false
   };
   let startDate: number, endDate: number, hasError = false;

   const requestFormBody = JSON.parse(event.body);
   const name = requestFormBody["name"];
   const completed = requestFormBody["completed"];
   const postedStartDate = requestFormBody["startDate"];
   const postedEndDate = requestFormBody["endDate"];

   if (postedStartDate) {
      startDate = Date.parse(postedStartDate);
      if (isNaN(startDate)) {
         budgetResponse.startDateError = "Invalid start date";
         hasError = true;
      }
   }
   if (postedEndDate) {
      endDate = Date.parse(postedEndDate);
      if (isNaN(endDate)) {
         budgetResponse.endDateError = "Invalid end date";
         hasError = true;
      }
   }

   if (hasError) {
      return {
         statusCode: 400,
         body: JSON.stringify(budgetResponse)
      }
   }

   // Update budget
   try {
      const updatedBudget = { name, completed, startDate, endDate };
      const budgetsService = new BudgetsService(userId);
      await budgetsService.update(budgetId, updatedBudget);
      budgetResponse.valid = true;
      budgetResponse.budgetId = budgetId;
      return {
         statusCode: 201,
         body: JSON.stringify(budgetResponse)
      }
   }
   catch (error) {
      budgetResponse.totalError = "Unable to update budget";
      return {
         statusCode: 400,
         body: JSON.stringify(budgetResponse)
      };
   }
}